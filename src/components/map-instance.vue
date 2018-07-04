<template>

    <div id="cip-map-anchor" :class="currentDataset">

        <div class="cip-scroll-guard" ref="scrollGuard">
            <p class="cip-label">Use ctrl + scroll to zoom the map</p>
        </div>

    </div>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';
import { mixins } from 'vue-class-component';

import sprintf from 'sprintf-js';
import { Subject, race } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

import api from './../api/';
import { MapPoint } from './../store/';
import { UpdateRouteMixin } from '../globals/mixin';

import { ColourRamp } from './../configs/datasets';

import TimeSlider from './time-slider.vue';
import MapColourRamp from './map-colour-ramp.vue';
import MapControlsCluster from './map-controls-cluster.vue';
import MapFineprint from './map-fineprint.vue';
import { DatasetId } from '@/types';

interface Tooltips {
    'en-CA': {
        [key: string]: {
            [key: string]: {
                [key: string]: string;
            };
        };
    };
    'fr-CA': { [key: string]: { [key: string]: { [key: string]: string } } };
    [key: string]: {
        [key: string]: { [key: string]: { [key: string]: string } };
    };
}

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

@Component
export default class MapInstance extends mixins(UpdateRouteMixin) {
    tooltipTemplates: Tooltips = {
        'en-CA': {
            ahccd: {
                tmean: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend (%(startYear)s-%(endYear)s): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                },
                tmin: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend (%(startYear)s-%(endYear)s): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                },
                tmax: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend (%(startYear)s-%(endYear)s): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                },
                precip: {
                    template: "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s</div>",
                    value_key: 'Annual_Annuel'
                }
            }
        },
        'fr-CA': {
            ahccd: {
                tmean: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (%(startYear)s-%(endYear)s): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                },
                tmin: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (%(startYear)s-%(endYear)s): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                },
                tmax: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (%(startYear)s-%(endYear)s): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                },
                precip: {
                    template: "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s</div>",
                    value_key: 'Annual_Annuel'
                }
            }
        }
    };

    get anchor(): HTMLElement {
        return document.getElementById('cip-map-anchor')!;
    }

    @State('variableId') currentVariable: string;
    @State('datasetId') currentDataset: string;
    @State('timePeriodId') currentTimePeriod: string;
    @State('featureId') currentFeature: string;
    @State('rcpId') currentRcp: string;
    @State timeSlice: number;
    @State centerPoint: MapPoint;
    @State locationPoint: MapPoint;
    @State zoomLevel: number;
    @State featurePoint: MapPoint;

    @Action setFeatureId: (value: string | null) => void;
    @Action setCenterPoint: (value: { x: number; y: number }) => void;
    @Action setFeaturePoint: (value: { x: number; y: number } | null) => void;
    @Action setZoomLevel: (value: number) => void;
    @Action setTileInfo: (value: number[] | null) => void;

    @Getter timeSliderLabels: string[] | undefined;
    @Getter legend: { [index: string]: string } | undefined;
    @Getter colourRamp: ColourRamp | null;
    @Getter datasetApi: any;

    // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
    counter = 0;

    currentLayers: any[];

    configVersion: number;

    @Watch('currentVariable')
    onVarChanged(newValue: string, oldValue: string) {
        this.switchLayers();
    }

    /**
     * Updates the current legend based on the selected variable and its dataset.
     */
    async updateLegend(): Promise<void> {
        const legends: { [name: string]: object[] } = await $.getJSON(
            `./assets/configs/${this.currentDataset}/${this.configVersion}/legend.json`
        );

        //DEMO, REMOVE
        const DEMO_MAPPINGS: { [key: string]: string } = {
            tmean: 'sfcwind',
            tmin: 'sic',
            tmax: 'sit',
            precip: 'sfcwind',
            sfcwind: 'sfcwind',
            sic: 'sic',
            sit: 'sit',
            snd: 'snd'
        };

        // TODO: update legend settings layers and link them to actual reference layers
        let legend = legends[DEMO_MAPPINGS[this.currentVariable]];
        if (!legend) {
            legend = [];
        } else {
            legend.forEach((entry: any) => {
                if (entry.layerId) {
                    // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
                    entry.layerId += `_${this.counter}`;
                }
            });
        }

        this._mapi.legendConfig = legend;
    }

    @Watch('currentRcp')
    onRcpChanged(newValue: string, oldValue: string) {
        this.switchLayers();
    }

    @Watch('currentTimePeriod')
    onTimePeriodChange() {
        this.switchLayers();
    }

    //async addCurrentVarLayer() {
    async switchLayers() {
        if (this._mapi.layers.allLayers.length > 0) {
            // .slice() to clone the array, otherwise indices will be skipped
            this._mapi.layers.allLayers.slice().forEach((layer: any) => {
                this._mapi.layers.removeLayer(layer.id);
            });
        }

        this.currentLayers = [];
        this.counter += 1;
        const layers = await this.datasetApi.getDataLayers(this.configVersion);
        layers.forEach((layer: any, index: number) => {
            if (index === this.timeSlice) {
                layer.state.visibility = true;
            }

            // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
            layer.id += `_${this.counter}`;
            const addedLayer = this._mapi.layers.addLayer(layer);
            this.currentLayers[index] = layer.id;
        });
        this.addReferenceLayers();
        this.updateLegend();
    }

    async addReferenceLayers() {
        const layers = await this.datasetApi.getReferenceLayers(this.configVersion);
        layers.forEach((layer: any, index: number) => {
            // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
            layer.id += `_${this.counter}`;
            this._mapi.layers.addLayer(layer);
        });
    }

    @Watch('timeSlice')
    onTimeSliceChanged(newValue: number, oldValue: number) {
        if (!this.timeSliderLabels) {
            return;
        }
        // turn off old layer
        this.getLayerById(this.currentLayers[oldValue]).visibility = false;
        // set new layer visible
        this.getLayerById(this.currentLayers[newValue]).visibility = true;
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

        const point = new api.RZ.GEO.Point(
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

        const xyCenter = new api.RZ.GEO.XY(this.centerPoint.x, this.centerPoint.y);
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

    deactivate: Subject<boolean> = new Subject<boolean>();

    // TODO: link to a language choice; property, or stored value, or button
    lang: string = 'en-CA';

    // TODO: link once dataSet selector is finalized
    dataSet: string = 'ahccd';

    get scrollGuardNode(): HTMLElement {
        return this.$refs.scrollGuard as HTMLElement;
    }

    async mounted(): Promise<void> {
        const RZ = (<any>window).RZ;
        await $.getJSON(`./assets/configs/${this.currentDataset}/current.json`, data => {
            this.configVersion = parseInt(data.version);
        });

        // if RAMP API is not ready yet, loop-wait until it's loaded
        if (!RZ) {
            window.setTimeout(() => this.mounted(), 500);
            return;
        }

        if (this.currentVariable === null || this.currentDataset === null) {
            console.log('cannot create the map - either variable or dataset is not set');
            return;
        }

        // tslint:disable-next-line:no-unused-expression
        new RZ.Map(this.anchor, `./assets/configs/${this.currentDataset}/${this.configVersion}/ramp.en-CA.json`);

        RZ.mapAdded.pipe(takeUntil(this.deactivate)).subscribe(async (mapi: any) => {
            this._mapi = mapi;

            this.injectCIPMapcomponents();
            this.switchLayers();

            // turn off default identify behaviour
            this._mapi.identify = false;

            // subscribe to Tooltips events
            this._mapi.ui.tooltip.mouseOver.pipe(takeUntil(this.deactivate)).subscribe(this.tooltipMouseOverHandler);
            this._mapi.ui.tooltip.mouseOut.pipe(takeUntil(this.deactivate)).subscribe(this.tooltipMouseOutHandler);

            // subscribe to the center change stream to update the url and store with the current center point
            this._mapi.centerChanged.subscribe(this.mapInstanceCenterChangedHandler);

            this._mapi.zoomChanged.subscribe(this.mapZoomChangedHandler);

            // set the identify mode to 'highlight' to prevent the details panel from opening
            if (this.currentDataset === DatasetId.AHCCD) {
                this._mapi.layers.identifyMode = 'highlight';
                // subscribe to identify events to track highlighted items
                this._mapi.layers.identify.subscribe(this.pointIdentifyHandler);
            } else {
                this._mapi.layers.identifyMode = 'silent';
                this._mapi.click.subscribe(this.gridIdentifyHandler);
            }

            this._mapi.mouseMove.pipe(throttleTime(30)).subscribe((event: any) => {
                // TODO: remove when RAMP bug https://github.com/fgpv-vpgf/fgpv-vpgf/issues/2612 is fixed
                if (!event.xy) {
                    return;
                }

                this.cursorPoint = new MapPoint(event.xy.x, event.xy.y);
            });

            document.querySelector('.rv-esri-map')!.addEventListener('wheel', this.scrollGuardHandler, {
                capture: true
            });

            // if the current feature is already set, draw grid
            if (this.featurePoint && this._mapi.identifyMode === 'silent') {
                await this.drawGrid(this.featurePoint, -1);
            }

            if (this.zoomLevel) {
                this.onZoomLevelChanged();
            } else {
                this.mapZoomChangedHandler(this._mapi.zoom);
            }
        });
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

    isMousedOver: boolean = false;

    tooltipMouseOverHandler(z: any): void {
        let tooltip;

        this.isMousedOver = true;

        z.event.preventDefault();
        z.attribs.then((a: any) => {
            if (!this.isMousedOver) {
                return;
            }

            const currentTemplate = this.tooltipTemplates[this.lang][this.dataSet][this.currentVariable!];

            const name = a.station_name_nom;
            let value = Intl.NumberFormat(this.lang).format(a[currentTemplate.value_key]);

            const startYear = a.beg_yr_annee_deb;
            const endYear = a.end_yr_annee_fin;

            if (parseFloat(value) > 0) {
                value = '+' + value;
            }

            tooltip = z.add(
                sprintf.sprintf(currentTemplate.template, <any>{
                    name,
                    value,
                    startYear,
                    endYear
                })
            );
        });
    }

    tooltipMouseOutHandler(event: any): void {
        this.isMousedOver = false;
    }

    /**
     * Handle the identify sesssion, but updating the routes with the feature coordinates
     *
     */
    async pointIdentifyHandler({ requests, event }: IdentifySession) {
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

            console.log(features);

            this.setFeaturePoint(event.xy);
            this.setFeatureId(stationId);
            this.updateRoute();
        });
    }

    async gridIdentifyHandler(event: any) {
        await this.drawGrid(event.xy, 0);
    }

    /**
     * Draw the geometry for the grid square containing xy
     *
     * @param xy the latlong point to draw the grid around
     * @param requestNum (should probably be replaced) used as an id for the polygon
     */
    async drawGrid(xy: { x: number; y: number }, requestNum: number) {
        // retrieve the geometry points from the api
        const { coordinates, gridId } = await this.datasetApi.getGeometryPoints(xy);

        // build the polygon
        const RZ = (<any>window).RZ;
        const poly = new RZ.GEO.Polygon(requestNum, coordinates);

        //update drawn geometry
        this._mapi.simpleLayer.removeGeometry();
        this._mapi.simpleLayer.addGeometry([poly]);

        // update the route
        this.setFeaturePoint(xy);
        this.setFeatureId(gridId);

        this.updateRoute();
    }

    scrollGuardHandler(event: WheelEvent): void {
        if (!this._mapi) {
            return;
        }

        const scrollGuardClassList = this.scrollGuardNode.classList;

        // prevent scroll unless ctrlKey is depressed
        if (!event.ctrlKey) {
            // this seems to be the only way to cancel wheel scroll in IE
            // it's enough to `stopPropagation` in other browsers, but in IE, the esri listener fires before this one
            // I couldn't find why this is happening, or how to stop it properly
            // using this esri function seems to be the simplest solution
            // TODO: use a proper API endpoint when it's created
            this._mapi._fgpMap._map.disableScrollWheelZoom();

            scrollGuardClassList.remove('cip-scrolling');
            scrollGuardClassList.add('cip-active');

            // proper use of timeout
            // remove scroll guard notification after two seconds
            window.setTimeout(() => scrollGuardClassList.remove('cip-active'), 2000);
        } else {
            scrollGuardClassList.remove('cip-active');
            scrollGuardClassList.add('cip-scrolling');

            this._mapi._fgpMap._map.enableScrollWheelZoom();
        }
    }

    beforeDestroy(): void {
        // deactivate all subscriptions when the component is being destroyed
        this.deactivate.next(true);
        this.deactivate.unsubscribe();
    }

    removeGridHighlight(): void {
        // TODO: AHCCD must be handled differently, it does not use geometry drawing
        // remove any geometry drawn on the map
        this._mapi.simpleLayer.removeGeometry();
        // clear the feature from the store + route
        this.setFeatureId(null);
        this.setFeaturePoint(null);
        this.updateRoute();
    }

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
                        'current-variable': this.currentVariable
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
                    props: { 'cursor-point': this.cursorPoint }
                }),
            components: {
                'map-fineprint': MapFineprint
            },
            i18n: this.$i18n
        }).$mount();

        const innerShell = this.$el.querySelector('.rv-inner-shell')!;
        innerShell.appendChild(controlClusterComponent.$el);
        innerShell.appendChild(fineprintComponent.$el);
    }
}
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';

#cip-map-anchor /deep/ {
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

    .cip-scroll-guard {
        transition: opacity ease-in-out;
        background-color: rgba(0, 0, 0, 0.45);
        text-align: center;

        position: relative;
        z-index: 2;
        height: 100%;
        width: 100%;
        padding: 0px;
        border-width: 0px;
        margin: 0px;
        left: 0px;
        top: 0px;
        opacity: 0;
        transition-duration: 0.8s;
        pointer-events: none;

        &.cip-active {
            opacity: 1;
            transition-duration: 0.3s;
        }

        &.cip-scrolling {
            transition-duration: 0.3s;
        }

        .cip-label {
            font-size: 1em * 1.5;
            color: white;
            position: relative;
            margin: 0;
            top: 50% !important;
            transform: translateY(-50%);
        }
    }
}

// specific CMIP5 styles to handle grid cell highlighting
#cip-map-anchor.cmip5 /deep/ {
    .rv-map-highlight .esriMapLayers {
        > div:not(:first-child),
        > svg > g:not([id='rv_hilight_layer']) {
            // do not change opacity of data layers
            opacity: inherit !important;
        }

        div[id$='cmip5_grid'] {
            // keep the grid layer fully transparent
            opacity: 0 !important;
        }
    }
}
</style>
