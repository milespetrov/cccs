<template>
    <div :id="`cip-map-anchor-${mapCounter}`" :class="datasetId" class="cip-map-anchor" rv-plugins="customExport"></div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';
import { mixins } from 'vue-class-component';

import sprintf from 'sprintf-js';

import { Subject, race } from 'rxjs';

import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { throttleTime } from 'rxjs/internal/operators/throttleTime';

import api, { DatasetApi } from './../api/';
import { MapPoint, XY } from '@/store/modules/app';
import { UpdateRouteMixin } from '../globals/mixin';
import { DatasetId, VariableId } from '@/types';

import { datasets, ColourRamp, DatasetSource } from './../configs/datasets';

import TimeSlider from './time-slider.vue';
import MapColourRamp from './map-colour-ramp.vue';
import MapControlsCluster from './map-controls-cluster.vue';
import MapFineprint from './map-fineprint.vue';
import MapScrollguard from './map-scrollguard.vue';
import MapPanguard from './map-panguard.vue';

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

const centerPntDeactivate: Subject<boolean> = new Subject<boolean>();
const deactivateLayers: Subject<boolean> = new Subject<boolean>();
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
    timeSlice: number;
    @StateApp
    centerPoint: MapPoint;
    @StateApp
    locationPoint: MapPoint;
    @StateApp
    zoomLevel: number;
    @StateApp
    analysisPeriod: string;
    // @StateApp featurePoint: MapPoint;
    @StateApp 
    lastClick: XY;

    @StateApp
    layerVisibility: {
        cities: boolean | null;
        labels: boolean | null;
        provinces: boolean | null;
    }

    //@ActionApp setFeatureId: (value: string | null) => void;
    @ActionApp
    setCenterPoint: (value: { x: number; y: number }) => void;
    // @ActionApp setFeaturePoint: (value: { x: number; y: number } | null) => void;
    @ActionApp
    setZoomLevel: (value: number) => void;
    @ActionApp
    setTileInfo: (value: number[] | null) => void;
    @ActionApp
    setLayerVisibility: (args: {layerId: string, value: boolean}) => void;
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

    // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
    counter = 0;

    currentLayers: any[];

    configVersion: number;

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
    onRcpChanged(newValue: string, oldValue: string) {
        this.switchLayers();
    }

    @Watch('currentTimePeriod')
    onTimePeriodChange() {
        this.switchLayers();
    }

    @Watch('datasetId')
    onDatasetChanged(newValue: DatasetSource) {
        this.updateIdentifyMode();
    }

    /**
     * Update the identify based on the currently selected dataset.
     */
    updateIdentifyMode() {
        const dataset = datasets[this.datasetId] as DatasetSource;
        this._mapi.layers.identifyMode = dataset.identifyMode;
    }

    refreshIdentify() {
        if (this.lastClick !== null) {
            this._mapi.identify(this.lastClick);
        }
    }

    getCapabilities(layerConfig: any): void {
        const getCapabilitiesUrl =
            layerConfig.url + '&REQUEST=GetCapabilities&LAYERS=' + layerConfig.layerEntries[0].id;
        $.get({
            url: getCapabilitiesUrl,
            success: this.parseTimeParam
        });
    }

    parseTimeParam(data: any): void {
        const timeDimension = $(data).find('Dimension[name=time]')[0];

        this.wmsTime.default = (<any>timeDimension.attributes).default.value;
        [, this.wmsTime.start, this.wmsTime.end, this.wmsTime.step] = /(.*Z)\/(.*Z)\/PT(\d\d?)H/.exec(
            (timeDimension.innerHTML || timeDimension.textContent)!
        )!;
    }

    async switchLayers() {
        if (!this._mapi) {
            return;
        }

        if (this._mapi.layers.allLayers.length > 0) {
            this.stopLayerSubscriptions();
            // .slice() to clone the array, otherwise indices will be skipped
            this._mapi.layers.allLayers.slice().forEach((layer: any) => {
                this._mapi.layers.removeLayer(layer.id);
            });
        }

        const source = await this.datasetApi.getDatasetSource(this.$i18n.locale);

        this.currentLayers = [];
        this.counter += 1;

        source.dataLayers.slice().forEach((layer: any, index: number) => {
            if (index === this.timeSlice) {
                layer.state.visibility = true;
            }

            // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
            layer.id += `_${this.counter}`;

            const layerPromise = this._mapi.layers.addLayer(layer);
            this.currentLayers[index] = layer.id;

            // wait for the visible data layer to load, then refresh identify if needed
            if (layer.state.visibility === true) {
                layerPromise.then(() => {
                    this.refreshIdentify();
                })
            }

            if (this.dateSlider) {
                if (this.timeSlice) {
                    layerPromise.then((addedLayers: any[]) => {
                        this.onTimeSliceChanged(this.timeSlice, 0);
                    });
                }

                this.getCapabilities(layer);
            }
        });

        source.supportLayers.slice().forEach((layer: any, index: number) => {
            // apply visibility to reference layers if stored
            if (this.layerVisibility[layer.id] !== null) {
                layer.state.visibility = this.layerVisibility[layer.id];
            } else {
                this.setLayerVisibility({ layerId: layer.id, value: layer.state.visibility});
            }

            // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
            const originalId: string = layer.id;
            layer.id += `_${this.counter}`;
            this._mapi.layers.addLayer(layer).then((addedLayers: any) => {
                // track the visibility of reference layers
                addedLayers[0].visibilityChanged.pipe(takeUntil(deactivateLayers)).subscribe((value: boolean) => {
                    this.setLayerVisibility({layerId: originalId, value});
                })
            });
        });

        // TODO: update legend settings layers and link them to actual reference layers
        // Updates the current legend based on the selected variable and its dataset.
        const legend = source.legend.slice();
        legend.forEach((legendEntry: any) => checkEntry(legendEntry, this.counter));
        this._mapi.mapI.setLegendConfig({
            root: {
                children: legend
            }
        });

        function checkEntry(legendEntry: any, counter: number) {
            if (!legendEntry.layerId) {
                const items = legendEntry.exclusiveVisibility || legendEntry.children || [];
                items.forEach((legendEntry: any) => checkEntry(legendEntry, counter));

                return;
            }

            // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
            legendEntry.layerId += `_${counter}`;
        }
    }

    @Watch('timeSlice')
    onTimeSliceChanged(newValue: number, oldValue: number) {
        $('rv-details rv-details-header .rv-close').click();
        if (this.timeSliderLabels) {
            // turn off old layer
            if (oldValue !== null && this.currentLayers) {
                this.getLayerById(this.currentLayers[oldValue]).visibility = false;
            }
            // set new layer visible
            if (newValue !== null && this.currentLayers) {
                this.getLayerById(this.currentLayers[newValue]).visibility = true;
            }
        } else if (this.dateSlider) {
            // removes the '.000' milliseconds from the string and reappends the 'Z'
            // having the milliseconds breaks the layers
            const timeString = new Date(this.timeSlice).toISOString().split('.')[0] + 'Z';
            // set the TIME param and reload
            this.currentLayers.forEach(layerId => {
                this.getLayerById(layerId)._viewerLayer.setCustomParameter('TIME', timeString);
            });
        }
        this.refreshIdentify();
    }

    getLayerById(searchId: string): any {
        return this._mapi.layers.allLayers.find((layer: any) => {
            return layer.id === searchId;
        });
    }

    @Watch('locationPoint')
    onLocationPointChanged(): void {
        if (!this._mapi || !this.locationPoint) {
            return;
        }

        this._mapi.simpleLayer.removeGeometry('centerPnt'); // remove existing center point if there is no interaction with the map between result selections
        centerPntDeactivate.next(true);

        const point = new api.RAMP.GEO.Point(
            'centerPnt',
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARuSURBVDiNjZVrbFRVEMd/5967e9vddbduN4WWYgXKKyVQWgIhkQBVqJIYCQZJI00UH2DiNxUUQwQNSfH1RYwghphoCIGADQk1QKqAGCKhCKTKq6GWbYHSdvve9u7ee8cP210LAjrJ+XAmM78zOf8zcxT/bROBYuDRkX03cA1ofliSeoDfBFYAz2UZemFZXsBf6De9gkvbQCJx7k7/4LAjrUAtcBBI/B/wDGBL6Zhg0cZ5E8YvKswJ+zRl4LqIOOC6xBO2fbytJ7a1oS16sSveDGwG/ngYuEJXatOnT06f9ErJuEINUYgLrosK5CDiID2d4LogLrbtyDeX7rSu/631msBHwPE0SB9dqa5Uzf4V5SWrpuXna6AQAQREyFqzGWPWAuwzR0j7Fag5EV+oPOILHGjuni5wFugYDTaB7Z8vmTFj1bSC/DQMEbRIAZ6FK9BL5qGCYVSWD4m1I4N9mZhJj3j9OR5dP3azf/LIvbtp8AulY0LPbF86c6oCBQKAt7Ia8+VN6BNKQNPA8GJMKcNTsRKUwrl6LlN9aTgreLSt37o9ZHcDjWnwpi+eLp01NdcfSAd6lq7GU7ma5C+1WF9tQC+ajnS3M7TtNZTpw1tZDeLiXGnIXEvEq+sHW3pN4IABTDR1fdyiotxwRtFIAZ4lVSRP1pI4+CW4Ltb3NSnxhgaw9n4GCOazr2KfrsNtv5FSPt8fztLV+GFHHteA4vL8kN/vNYw02CirANcl+eO3GWWlL4b0xTL7RO0OEBdj/rKMz2doRmk42wcUa0BuYcjvBVA5EczXt6aCHRtzzQeoUG7qsLlLMeZWko7LeqMGsW28i1fie2cnWngsAIU+wwtENEBERO55z/zLcT+7T3uN5IkGdLX1xZMA0tOJ9fX72KfrULqOtXsL0tsFgH3maOoNj8QN73gPpRskftpH/JO1uLHbAETjdgLo1ICmhlu9gwMJ206fajfUg9LwLHvpn+KCYVQwoy/e5esAhX26LuMbTLr2hdhQHGjSgGbLcaInWroyykjXLZLH9uBZsBzv82+isv2Yq98lq3ojKjuAWfU2nsUrsQ7twu1oy4B/vj0YsxyJAi3pW6qaOSb01qnqJ8r09HwQwXiqCu/SF0EEsZOpyg0PKEXi0C6sw7vBcUBckrYjCw83nWvsGf4Y2JdukKvtg1ZFxGcG54wNhdIt7TRdwGmoR4b60QsmgpMkWb8X67sa7PMnMi0Nws5LndE913saga2MamkHuFjf3DF/dn4oUJzj86eTJN6He+08+pRypC+G9f221JwYNU+ORHs71v0avQxsANrh7unWJXBj/6Wb08LZHr00LxjU0nNDBOfyWewLJ2E4nqnSdlzZ+eed6NpTNy4LfEhqunEvGOAvoOFoc+fkuusdw3l+0ygMmKZXUxrDccRKQQcs2z7S2tO55vj1K3uaYo3A+tFQePDX5CH1NS03dTV+dl7Q91jANAWXaH/C+r2jPz6i/g8jK3kv4EHg0VYETOHuz/Qq0PKwpL8BL8EAdKaMj7AAAAAASUVORK5CYII=',
            [this.locationPoint.x, this.locationPoint.y]
        );

        this._mapi.simpleLayer.addGeometry(point);

        race(
            this._mapi.boundsChanged
                .skip(2)
                .takeUntil(centerPntDeactivate)
                .take(1), // skip first two boundChange as the map pans and zooms
            this._mapi.mouseDown.takeUntil(centerPntDeactivate).take(1)
        ).subscribe(() => this._mapi.simpleLayer.removeGeometry('centerPnt'));

        this._mapi.simpleLayer._layerProxy.zoomToGraphic('centerPnt', this._mapi._fgpMap, { x: 0, y: 0.1 });
        this.updateRoute();
    }

    @Watch('centerPoint')
    onCenterPointChanged(): void {
        if (!this._mapi) {
            return;
        }

        if (this.localCenterPointUpdate) {
            this.localCenterPointUpdate = false;
            return;
        }

        const xyCenter = new api.RAMP.GEO.XY(this.centerPoint.x, this.centerPoint.y);
        this._mapi.setCenter(xyCenter);
    }

    @Watch('zoomLevel')
    onZoomLevelChanged(): void {
        if (this.localZoomLevelUpdate) {
            this.localZoomLevelUpdate = false;
            return;
        }
        this._mapi.zoom = this.zoomLevel;
    }

    localCenterPointUpdate: boolean = false;
    localZoomLevelUpdate: boolean = false;

    // leading `_` is used to prevent Vue from poking all the propertise on this reference and making in an attempt to make it reactive
    _mapi: any;

    // the last coordinates of the mouse cursor
    cursorPoint: MapPoint = new MapPoint(0, 0);
    // current resolution of the map
    resolution: number = 0;

    deactivate: Subject<boolean> = new Subject<boolean>();

    // TODO: link to a language choice; property, or stored value, or button
    lang: string = 'en-CA';

    // TODO: link once dataSet selector is finalized
    dataSet: string = 'ahccd';

    async mounted(): Promise<void> {
        const RAMP = (<any>window).RAMP;

        // if RAMP API is not ready yet, loop-wait until it's loaded
        if (!RAMP) {
            window.setTimeout(() => this.mounted(), 500);
            return;
        }

        if (this.currentVariable === null || this.datasetId === null) {
            console.log('cannot create the map - either variable or dataset is not set');
            return;
        }

        // tslint:disable-next-line:no-unused-expression
        new RAMP.Map(this.anchor, './assets/configs/ramp.[lang].json');

        RAMP.mapAdded.pipe(takeUntil(this.deactivate)).subscribe(async (mapi: any) => {
            this._mapi = mapi;

            this.updateIdentifyMode();
            this.injectCIPMapcomponents();
            this.switchLayers();
            this.mapBoundsChangeHandler();

            // subscribe to the center change stream to update the url and store with the current center point
            this._mapi.centerChanged.subscribe(this.mapInstanceCenterChangedHandler);

            this._mapi.zoomChanged.subscribe(this.mapZoomChangedHandler);

            // use `boundsChanged` pipe to update resolution/scale because `zoomChanged` fires before the map has actually zoomed
            this._mapi.boundsChanged.subscribe(this.mapBoundsChangeHandler);

            // subscribe to Tooltips events
            this._mapi.ui.tooltip.mouseOver.pipe(takeUntil(this.deactivate)).subscribe(this.tooltipMouseOverHandler);
            this._mapi.ui.tooltip.mouseOut.pipe(takeUntil(this.deactivate)).subscribe(this.tooltipMouseOutHandler);

            this._mapi.mouseMove.pipe(throttleTime(30)).subscribe((event: any) => {
                // TODO: remove when RAMP bug https://github.com/fgpv-vpgf/fgpv-vpgf/issues/2612 is fixed
                if (!event.xy) {
                    return;
                }

                this.cursorPoint = new MapPoint(event.xy.x, event.xy.y);
            });

            this._mapi.click.pipe(takeUntil(this.deactivate)).subscribe(this.mapClickHandler);

            // if the current feature is already set, draw grid
            // NOTE: reselecting the previously selected feature from a bookmar is disabled for now
            /* if (this.featurePoint && this._mapi.identifyMode === 'silent') {
                await this.drawGrid(this.featurePoint, -1);
            } */

            if (this.zoomLevel) {
                this.onZoomLevelChanged();
            } else {
                this.mapZoomChangedHandler(this._mapi.zoom);
            }

            if (this.centerPoint) {
                this.onCenterPointChanged();
            }
        });
    }

    isMousedOver: boolean = false;

    tooltipMouseOverHandler(z: any): void {
        let tooltip;

        this.isMousedOver = true;

        if (!this.datasetApi.tooltip) {
            return;
        }

        z.event.preventDefault();
        z.attribs.then((a: any) => {
            if (!this.isMousedOver) {
                return;
            }

            const currentTemplate = this.datasetApi.getTooltip(a);
            if (!currentTemplate) {
                return;
            }

            tooltip = z.add(currentTemplate);
        });
    }

    tooltipMouseOutHandler(event: any): void {
        this.isMousedOver = false;
    }

    mapInstanceCenterChangedHandler(event: any): void {
        // make sure the centerpoint is new
        if (this.centerPoint && this.centerPoint.x === event.x && this.centerPoint.y === event.y) {
            return;
        }

        this.localCenterPointUpdate = true;

        this.setCenterPoint(event);

        // update zoom if we're out of sync
        if (this._mapi.zoom !== this.zoomLevel) {
            this.localZoomLevelUpdate = true;
            this.setZoomLevel(this._mapi.zoom);
        }
        this.updateRoute();
    }

    mapZoomChangedHandler(event: any): void {
        this.localZoomLevelUpdate = true;

        this.setZoomLevel(event);
        this.updateRoute();
    }

    mapBoundsChangeHandler(): void {
        // TODO: ask Miles to add resolution to the API
        this.resolution = this._mapi.mapI._map.getResolution();
    }

    mapClickHandler(clickEvent: any): void {
        this.setLastClick(clickEvent.xy);
    }

    /**
     * Handle the identify sesssion, but updating the routes with the feature coordinates
     *
     */
    /* async pointIdentifyHandler({ requests, event }: IdentifySession) {
        if (requests.length === 0) {
            return;
        }
        requests[0].features.then((features: IdentifyResult[]) => {
            if (features.length === 0) {
                return;
            }

            // if multiple features are received, leave only one
            features.splice(1);

            const feature = features[0].data.find(({ key }) => key === 'AHCCD Station ID');
            const stationId = feature ? feature.value.toString() : '';

            // features.find(feature => )

            this.setFeaturePoint(event.xy);
            this.setFeatureId(stationId);
            this.updateRoute();
        });
    } */

    /* async gridIdentifyHandler(event: any) {
        await this.drawGrid(event.xy, 0);
    } */

    /**
     * Draw the geometry for the grid square containing xy
     *
     * @param xy the latlong point to draw the grid around
     * @param requestNum (should probably be replaced) used as an id for the polygon
     */
    /* async drawGrid(xy: { x: number; y: number }, requestNum: number) {
        // retrieve the geometry points from the api
        // const { coordinates, gridId } = await this.datasetApi.getGeometryPoints(xy);

        // build the polygon
        const RAMP = (<any>window).RAMP;
        const poly = new RAMP.GEO.Polygon(requestNum, coordinates);

        //update drawn geometry
        this._mapi.simpleLayer.removeGeometry();
        this._mapi.simpleLayer.addGeometry([poly]);

        // update the route
        this.setFeaturePoint(xy);
        this.setFeatureId(gridId);

        this.updateRoute();
    } */

    beforeDestroy(): void {
        // deactivate all subscriptions when the component is being destroyed
        this.deactivate.next(true);
        this.deactivate.unsubscribe();
    }

    stopLayerSubscriptions(): void {
        deactivateLayers.next(true);
    }

    /* removeGridHighlight(): void {
        // TODO: AHCCD must be handled differently, it does not use geometry drawing
        // remove any geometry drawn on the map
        this._mapi.simpleLayer.removeGeometry();
        // clear the feature from the store + route
        this.setFeatureId(null);
        this.setFeaturePoint(null);
        this.updateRoute();
    } */

    /**
     * Adds timeline and fineprint components inside the RAMP inner-shell node so they are included into the RAMP tab order.
     * This also helps to position and align the components together with other RAMP components when the browser window is resized.
     */
    injectCIPMapcomponents(): void {
        // TODO: when RAMP api supports it, move them inside the ramp container

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

        const fineprintComponent = new Vue({
            render: h =>
                h('map-fineprint', {
                    props: { 'cursor-point': this.cursorPoint, resolution: this.resolution }
                }),
            components: {
                'map-fineprint': MapFineprint
            },
            i18n: this.$i18n
        }).$mount();

        const scrollguardComponent = new Vue({
            render: h =>
                h('map-scrollguard', {
                    props: { _mapi: this._mapi }
                }),
            components: {
                'map-scrollguard': MapScrollguard
            },
            i18n: this.$i18n
        }).$mount();

        const panguardComponent = new Vue({
            render: h =>
                h('map-panguard', {
                    props: { _mapi: this._mapi }
                }),
            components: {
                'map-panguard': MapPanguard
            },
            i18n: this.$i18n
        }).$mount();

        const innerShell = this.$el.querySelector('.rv-inner-shell')!;
        innerShell.appendChild(controlClusterComponent.$el);
        innerShell.appendChild(fineprintComponent.$el);

        // insert the scrollguard as the first child of the inner shell
        // this will place the guard above the map, but below all other RAMP controls
        // when the guard is active, it grays out the map, but not the controls
        innerShell.insertBefore(scrollguardComponent.$el, innerShell.firstChild);

        innerShell.insertBefore(panguardComponent.$el, innerShell.firstChild);
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
</style>
