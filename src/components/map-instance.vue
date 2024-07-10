<template>
    <div :id="`cip-map-anchor-${mapCounter}`" :class="datasetId" class="cip-map-anchor" rv-plugins="customExport"></div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';
import { mixins } from 'vue-class-component';

import sprintf from 'sprintf-js';
import {debounce} from 'throttle-debounce';

import { Subject, race } from 'rxjs';

import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { throttleTime } from 'rxjs/internal/operators/throttleTime';

import api, { DatasetApi } from './../api/';
import { MapPoint, XY } from '@/store/modules/app';
import { UpdateRouteMixin } from '../globals/mixin';
import { DatasetId, VariableId, TimePeriodType } from '@/types';

import { datasets, ColourRamp, DatasetSource } from './../configs/datasets';

import registerDetailsTemplates from '@/detailsTemplates';

import TimeSlider from './time-slider.vue';
import MapColourRamp from './map-colour-ramp.vue';
import MapControlsCluster from './map-controls-cluster.vue';
import MapFineprint from './map-fineprint.vue';
import MapScrollguard from './map-scrollguard.vue';
import MapPanguard from './map-panguard.vue';
import { monthSelectorConfig, supplementalLayersEn, supplementalLayersFr, SupplementalLayers, } from '../configs/selectors';
import { customRendererStartup } from '@/../assets/scripts/customExport';
import { registerCustomAppbarLink } from '@/../assets/scripts/customAppbarLink';

// TODO: import proper RAMP definitions
export interface IdentifyResult {
    data: { key: string; value: string | number }[];
    name: string;
    oid: string;
    symbology: { svgcode: string }[];
}

export interface IdentifyRequest {
    sessionId: number;
    event: any;
    layer: any;
    features: Promise<IdentifyResult[]>;
}

export interface IdentifySession {
    sessionId: number;
    event: any;
    requests: IdentifyRequest[];
}

const StateApp = namespace('app', State);
const GetterApp = namespace('app', Getter);
const ActionApp = namespace('app', Action);

@Component
export default class MapInstance extends mixins(UpdateRouteMixin) {
    get anchor(): HTMLElement {
        return document.getElementById(`cip-map-anchor-${this.mapCounter}`)!;
    }

    @StateApp('variableId')
    currentVariable: VariableId;
    @StateApp
    datasetId: DatasetId;
    @StateApp('timePeriodId')
    currentTimePeriod: string;
    //@StateApp('featureId') currentFeature: string;
    @StateApp('rcpId')
    currentRcp: string;
    @StateApp
    sspId: string;
    @StateApp
    timeSlice: number;
    @StateApp
    centerPoint: MapPoint;
    @StateApp
    zoomLevel: number;
    @StateApp
    analysisPeriod: string;
    @StateApp
    lastClick: XY;
    @StateApp
    day: string;
    @StateApp
    month: string;
    @StateApp
    supplementalIds: string[];

    @StateApp
    layerVisibility: {
        cities: boolean | null;
        labels: boolean | null;
        provinces: boolean | null;
    };

    //@ActionApp setFeatureId: (value: string | null) => void;
    @ActionApp
    setCenterPoint: (value: { x: number; y: number }) => void;
    // @ActionApp setFeaturePoint: (value: { x: number; y: number } | null) => void;
    @ActionApp
    setZoomLevel: (value: number) => void;
    @ActionApp
    setTileInfo: (value: number[] | null) => void;
    @ActionApp
    setLayerVisibility: (args: { layerId: string; value: boolean }) => void;
    @ActionApp
    setLastClick: (value: XY | null) => void;

    @GetterApp
    timeSliderLabels: string[] | undefined;
    @GetterApp
    legend: { [index: string]: string } | undefined;
    @GetterApp
    colourRamp: ColourRamp | null;
    @GetterApp
    datasetApi: DatasetApi;
    @GetterApp
    dateSlider: any;

    @Prop()
    mapCounter: string;

    currentLayers: any[];
    supplementalLayersEn: SupplementalLayers = supplementalLayersEn;
    supplementalLayersFr: SupplementalLayers = supplementalLayersFr;

    wmsTime: any = { start: '', end: '', step: '' };

    @Watch('currentVariable')
    onVarChanged(newValue: string, oldValue: string) {
        api.dcsMultiTrack(
            'DCSext.cccs_variable_selected',
            newValue,
            'DCSext.cccs_datavar_set',
            `${this.datasetId}-${newValue}`,
            'WT.ti',
            `${newValue} selected on ${this.datasetId}.`
        );
        this.switchLayers();
    }

    @Watch('currentRcp')
    onRcpChanged() {
        this.switchLayers();
    }

    @Watch('sspId')
    onSspChanged() {
        this.switchLayers();
    }

    @Watch('currentTimePeriod')
    onTimePeriodChange() {
        this.switchLayers();
    }

    @Watch('datasetId')
    onDatasetChanged() {
        //this.updateIdentifyMode();
    }

    @Watch('month')
    onMonthChanged() {
        this.switchLayers();
    }

    @Watch('day')
    onDayChanged() {
        this.switchLayers();
    }

    /**
     * Update the identify based on the currently selected dataset.
     */
    /* updateIdentifyMode() {
        const dataset = datasets[this.datasetId] as DatasetSource;
        this._mapi.layers.identifyMode = dataset.identifyMode;
    } */

    refreshIdentify() {
        if (this.lastClick !== null) {
            this._rInstance.geo.map.runIdentify(this.lastClick);
        }
    }

    getCapabilities(layerConfig: any): void {
        const getCapabilitiesUrl =
            layerConfig.url + '&REQUEST=GetCapabilities&LAYERS=' + layerConfig.sublayers[0].id;
        $.get(getCapabilitiesUrl).then((data) => { this.parseTimeParam(data) });
    }

    parseTimeParam(data: any): void {
        const timeDimension = $(data).find('Dimension[name=time]')[0];

        this.wmsTime.default = (<any>timeDimension.attributes).default.value;
        [, this.wmsTime.start, this.wmsTime.end, this.wmsTime.step] = /(.*Z)\/(.*Z)\/PT(\d\d?)H/.exec(
            (timeDimension.innerHTML || timeDimension.textContent)!
        )!;
    }

    async switchLayers() {
        this._rInstance.event.off('cccs_refreshIdentifyOnLayerLoad');
        if (!this._rInstance || !this._rInstance.geo.map.created) {
            return;
        }

        let tempLastClick: XY | null = null;

        // store lastclick before changing layers closes the details panel and loses it
        if (this.lastClick !== null) {
            tempLastClick = this.lastClick;
        }

        if (this._rInstance.geo.layer.allLayers().length > 0) {
            this.stopLayerSubscriptions();
            // .slice() to clone the array, otherwise indices will be skipped
            this._rInstance.geo.layer.allLayers().slice().forEach((layer: any) => {

                // we can just let the two system layers lurk. Since new layers are added without
                // an index parameter, the insertion algo will make sure they are under these
                // cosmetic layers.
                // Since identify fixture listens for layers changing & panel closing,
                // will ensure any active hilights get cleared when layers switch.
                if (!(layer.id === 'Ramp-Hilight' || layer.id === 'RampPoleMarker')) {
                    this._rInstance.geo.map.removeLayer(layer.id);
                }
            });
        }

        const source = await this.datasetApi.getDatasetSource(this.$i18n.locale);

        this.currentLayers = [];

        // DATA LAYERS
        source.dataLayers.slice().forEach((layer: any, index: number) => {
            if (index === this.timeSlice) {
                layer.state.visibility = true;
            }

            // LTCE non-station variables need day & month added to the query
            // This keeps us from needing ~2000 configs
            // They also need the value set for the custom renderer
            if (this.datasetId === DatasetId.LTCE && !this.currentVariable.includes('station')) {
                const selectedMonth = monthSelectorConfig.groups[0].items.indexOf(this.month as TimePeriodType) + 1;
                layer.url += '?LOCAL_DAY=' + this.day + '&LOCAL_MONTH=' + selectedMonth.toString();

                // Setting value for custom renderer, current year if the day has happened, last year if not
                const currentDate = new Date();
                if (currentDate.getUTCMonth() + 1 > selectedMonth) {
                    layer.customRenderer.uniqueValueInfos[0].value = currentDate.getUTCFullYear();
                    // months are 0 indexed for some reason??
                } else if (currentDate.getUTCMonth() + 1 === selectedMonth) {
                    if (currentDate.getUTCDate() >= parseInt(this.day)) {
                        layer.customRenderer.uniqueValueInfos[0].value = currentDate.getUTCFullYear();
                    } else {
                        layer.customRenderer.uniqueValueInfos[0].value = currentDate.getUTCFullYear() - 1;
                    }
                } else {
                    layer.customRenderer.uniqueValueInfos[0].value = currentDate.getUTCFullYear() - 1;
                }
            }

            if (layer.fixtures && layer.fixtures.grid && !layer.fieldMetadata) {
                layer.fieldMetadata = {};
                layer.fieldMetadata.fieldInfo = Object.values(layer.fixtures.grid.columns).filter((column: any) => {
                    return column.visible;
                }).map((column: any) => {
                    return {
                        name: column.field
                    }
                });
                layer.fieldMetadata.exclusiveFields = true;
                layer.fieldMetadata.enforceOrder = true;
            }

            const layerObj = this._rInstance.geo.layer.createLayer(layer)
            const layerPromise = this._rInstance.geo.map.addLayer(layerObj);
            this.currentLayers[index] = layer.id;

            // wait for the visible data layer to load, then refresh identify if needed
            if (layer.state.visibility === true && tempLastClick !== null && layer.layerType !== 'ogc-wfs') {
                // layer promise does not actually wait for layer to be loaded, only registered
                // use a callback on layer state change to look for 'loaded' state on the visible layer
                const refreshIdentifyOnLayerLoad = (event: {state: string, layer: any}) => {
                    if (event.layer.id === layer.id && event.state === 'loaded') {
                        this._rInstance.event.off('cccs_refreshIdentifyOnLayerLoad');
                        this.setLastClick(tempLastClick);
                        this.refreshIdentify();
                    }
                };
                this._rInstance.event.on('layer/layerstatechange', refreshIdentifyOnLayerLoad, 'cccs_refreshIdentifyOnLayerLoad');
            }

            if (this.dateSlider) {
                if (this.timeSlice !== null) {
                    layerPromise.then((addedLayers: any[]) => {
                        this.onTimeSliceChanged(this.timeSlice, 0);
                    });
                }

                layerPromise.then(this.getCapabilities(layer));
            }
        });

        const supportLayerIds: string[] = [];

        // SUPPORT LAYERS
        source.supportLayers.slice().forEach((layer: any, index: number) => {
            // apply visibility to reference layers if stored
            if (this.layerVisibility[layer.id] !== null) {
                layer.state.visibility = this.layerVisibility[layer.id];
            } else {
                this.setLayerVisibility({ layerId: layer.id, value: layer.state.visibility });
            }

            supportLayerIds.push(layer.id);

            const layerObj = this._rInstance.geo.layer.createLayer(layer);
            this._rInstance.geo.map.addLayer(layerObj);
        });

        this._rInstance.event.on('layer/visibilitychanged', (layer: any) => {
            if (supportLayerIds.includes(layer.id)) {
                this.setLayerVisibility({ layerId: layer.id, value: layer.visibility });
            }
        }, 'cccs_layervisibility_handler');

        // LEGEND
        const legend = source.legend.slice();
        const legendAPI = this._rInstance.fixture.get('legend');

        legend.forEach((element: any) => {
            if (this.timeSlice !== null && element.layerId && !supportLayerIds.includes(element.layerId)) {
                element.layerId = this.currentLayers[this.timeSlice];
            }
        });

        // remove old legend stuff.
        // assumes no groups. If we need group support, this has to become a recursive crawler or dangerloop,
        legendAPI.getLegend().forEach((item: any) => legendAPI.removeItem(item.uid));

        legendAPI._parseConfig({
            root: {
                children: legend
            }
        });

        // preserve toggled supplemental layers
        this.supplementalIds.forEach((layerId) => {
            this.addSupplementalLayer(layerId);
        })
    }

    addSupplementalLayer(layerId: string) {
        const layerConfig = this.$i18n.locale === 'en' ? this.supplementalLayersEn[layerId] : this.supplementalLayersFr[layerId];
        const layerToAdd = this._rInstance.geo.layer.createLayer(layerConfig);
        this._rInstance.geo.map.addLayer(layerToAdd); 
        this._rInstance.fixture.get('legend').addLayerItem(layerToAdd);
    }

    @Watch('timeSlice')
    onTimeSliceChanged(newValue: number, oldValue: number) {
        if (this.timeSliderLabels && this.currentLayers) {
            // RAMP4 does not support collapsed visibility sets;
            // we have to swap the layer the legend item points to
            const oldLayer = this.currentLayers[oldValue | 0];
            const layerItem = this._rInstance.fixture.get('legend').getLayerItem(oldLayer);
            layerItem._layerId = this.currentLayers[newValue];
            this._rInstance.fixture.get('legend').updateLegend(this._rInstance.geo.layer.getLayer(this.currentLayers[newValue]));
            // turn off old layer
            if (oldValue !== null) {
                this._rInstance.geo.layer.getLayer(this.currentLayers[oldValue]).visibility = false;
            }
            // set new layer visible
            if (newValue !== null) {
                this._rInstance.geo.layer.getLayer(this.currentLayers[newValue]).visibility = true;
            }
        } else if (this.dateSlider) {
            // removes the '.000' milliseconds from the string and reappends the 'Z'
            // having the milliseconds breaks the layers
            const timeString = new Date(this.timeSlice).toISOString().split('.')[0] + 'Z';
            // set the TIME param and reload
            this.currentLayers.forEach((layerId) => {
                const layer = this._rInstance.geo.layer.getLayer(layerId);
                // TODO: there is a bug in RAMP where the custom param array doesnt exist on the layer when it is assumed it does
                //       Remove after its fixed.
                if (!layer.esriLayer.customLayerParameters) {
                    layer.esriLayer.customLayerParameters = [];
                }
                layer.setCustomParameter('TIME', timeString);
            });
        }
        this.refreshIdentify();
    }

    @Watch('centerPoint')
    onCenterPointChanged(): void {
        if (!this._rInstance) {
            return;
        }

        if (this.localCenterPointUpdate) {
            this.localCenterPointUpdate = false;
            return;
        }

        const center = new this._rInstance.geo.geom.Point('centerPoint', [this.centerPoint.x, this.centerPoint.y], 3978);
        this._rInstance.geo.map.zoomMapTo(center, this._rInstance.geo.map.getScale());
    }

    @Watch('zoomLevel')
    onZoomLevelChanged(): void {
        if (this.localZoomLevelUpdate) {
            this.localZoomLevelUpdate = false;
            return;
        }
        this._rInstance.geo.map.zoomToLevel(this.zoomLevel);
    }

    extentFromBasemapDone: boolean = false;
    localCenterPointUpdate: boolean = false;
    localZoomLevelUpdate: boolean = false;

    // _ stops vue reactivity on giant API object
    _rInstance: any;

    async mounted(): Promise<void> {
        const RAMP = (<any>window).RAMP;

        // if RAMP API is not ready yet, loop-wait until it's loaded
        if (!RAMP) {
            window.setTimeout(() => this.mounted(), 500);
            return;
        }

        if (this.currentVariable === null || this.datasetId === null) {
            return;
        }

        // RAMP4 requires config as object, need to fetch the file ourselves
        fetch(`./assets/configs/ramp.${this.$i18n.locale}-CA.json`).then((data) => {
            data.json().then((rampConfig: any) => {
                this._rInstance = RAMP.createInstance(this.anchor, rampConfig);
                (window as any).debugInstance = this._rInstance;
                this._rInstance.event.on('map/created', this.mapStartup);
                registerCustomAppbarLink(this._rInstance, this.$i18n.t('downloadSelector.dataCatalogue.fullName'), 1);
                registerCustomAppbarLink(this._rInstance, this.$i18n.t('downloadSelector.queryTool.fullName'), 2);
            });
        });
    }

    async mapStartup(): Promise<void> {
        customRendererStartup(this._rInstance, this.$store.state.app, this.$i18n);
        //this.updateIdentifyMode();
        this.injectCIPMapcomponents();
        this.switchLayers();
        this.updateRoute();

        // RAMP4 is vue3 which doesnt have truly global components
        // so we do this every time the RAMP instance is made (only for the current dataset)
        registerDetailsTemplates(this._rInstance, this.datasetId);

        // zoom and center point handler
        this._rInstance.event.on('map/extentchanged', debounce(300, this.mapExtentChangedHandler), 'cccs_extentchanged_handler');

        // replace default maptips with fancy ones
        this._rInstance.event.off('ramp_map_graphichit_creates_maptip');
        this._rInstance.event.on('map/graphichit', this.tooltipHandler, 'cccs_graphichit_handler');

        // track map clicks to open up details when layer changes
        this._rInstance.event.on('map/click', this.mapClickHandler, 'cccs_mapclick_handler');
        this._rInstance.event.on('panel/closed', this.detailsClosingHandler, 'cccs_panelclose_handler');

        if (this.zoomLevel) {
            await this._rInstance.geo.map.zoomToLevel(this.zoomLevel);
        }

        if (this.centerPoint) {
            const center = new this._rInstance.geo.geom.Point('centerPoint', [this.centerPoint.x, this.centerPoint.y], 3978);
            await this._rInstance.geo.map.zoomMapTo(center, this._rInstance.geo.map.getScale());
        }

        this.extentFromBasemapDone = true;
    }

    tooltipHandler(info: any): void {
        if (!this.datasetApi.tooltip) {
            return;
        }

        const currentTemplate = this.datasetApi.getTooltip(info.attributes);
        if (!currentTemplate) {
            return;
        }

        this._rInstance.geo.map.maptip.setContent(currentTemplate);
    }

    mapExtentChangedHandler(extent: any): void {
        if (!this.extentFromBasemapDone) {
            return;
        }
        const newCenter = extent.center();
        // round to make bookmark smaller.
        // NOTE if we ever support a basemap schema-set in lat-long coord system,
        //      this will be need to change to allow around 4 decimal points for
        //      that schema.
        newCenter.x = Math.round(newCenter.x);
        newCenter.y = Math.round(newCenter.y);

        // make sure the centerpoint is new
        if (!this.centerPoint || this.centerPoint.x !== newCenter.x || this.centerPoint.y !== newCenter.y) {
            this.localCenterPointUpdate = true;
            this.setCenterPoint(newCenter);
        }

        // update zoom if we're out of sync
        const newZoom = this._rInstance.geo.map.getZoomLevel();
        if (newZoom % 1 === 0 && newZoom !== this.zoomLevel) {
            this.localZoomLevelUpdate = true;
            this.setZoomLevel(newZoom);
        }
        this.updateRoute();
    }

    mapClickHandler(mapClick: any): void {
        this.setLastClick(mapClick);
    }

    detailsClosingHandler(panel: any): void {
        if (panel.id === 'details-panel') {
            this.setLastClick(null);
        }
    }

    beforeDestroy(): void {
        this._rInstance.event.off('cccs_extentchanged_handler');
        this._rInstance.event.off('cccs_graphichit_handler');
        this._rInstance.event.off('cccs_mapclick_handler');
        this._rInstance.event.off('cccs_panelclose_handler');
    }

    stopLayerSubscriptions(): void {
        this._rInstance.event.off('cccs_layervisibility_handler');
    }

    /**
     * Adds timeline and fineprint components inside the RAMP inner-shell node so they are included into the RAMP tab order.
     * This also helps to position and align the components together with other RAMP components when the browser window is resized.
     */
    injectCIPMapcomponents(): void {
        // render component off DOM and inject it into the RAMP inner-shell container node
        // it's not possible to rendre just the component and pass them binding props;
        // instead, a new Vue instance needs to be created with these components used it its template
        const controlClusterComponent = new Vue({
            render: h =>
                h('map-controls-cluster', {
                    props: {
                        'time-slider-labels': this.timeSliderLabels,
                        'colour-ramp': this.colourRamp,
                        legend: this.legend,
                        'current-variable': this.currentVariable,
                        'current-dataset': this.datasetId,
                        'date-slider': this.dateSlider,
                        wmsTime: this.wmsTime
                    }
                }),
            components: {
                'map-controls-cluster': MapControlsCluster
            },
            router: this.$router,
            store: this.$store,
            i18n: this.$i18n
        }).$mount();

        //const controlClusterPanel = document.createElement('div');
        //controlClusterPanel.classList.add('cip-controls-cluster-container');
        this._rInstance.$vApp.$el.querySelector('.inner-shell').appendChild(controlClusterComponent.$el);
        //controlClusterPanel.appendChild(controlClusterComponent.$el);
    }
}
</script>

<style lang="scss" scoped>
@import "./../styles/variables.scss";

.cip-map-anchor /deep/ {
    /* right: 0;
    left: 0;
    width: 100%; */
    height: $backdrop-map-height;
    // position: absolute;

    .cip-fake-map-pin {
        position: absolute;
        top: calc(50% - 11px);
        left: calc(50% - 11px);
        pointer-events: none;
    }
}

// specific CMIP5 styles to handle grid cell highlighting
.cip-map-anchor.cmip5 /deep/ {
    .rv-map-highlight .esriMapLayers {
        > div:not(:first-child),
        > svg > g:not([id="rv_hilight_layer"]) {
            // do not change opacity of data layers
            opacity: inherit !important;
        }

        div[id$="cmip5_grid"] {
            // keep the grid layer fully transparent
            opacity: 0 !important;
        }
    }
}

.cip-map-anchor /deep/ {
    .detailsContentSection {
        > div {
            margin-left: 0;
        }
    }
}
</style>
