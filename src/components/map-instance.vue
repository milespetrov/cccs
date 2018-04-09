<template>

    <div id="cip-map-anchor" :class="currentDataset">

        <div ref="scrollGuard" class="cip-scroll-guard">
            <p class="cip-label">Use ctrl + scroll to zoom the map</p>
        </div>

        <img v-if="mapPin" class="cip-fake-map-pin" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARuSURBVDiNjZVrbFRVEMd/5967e9vddbduN4WWYgXKKyVQWgIhkQBVqJIYCQZJI00UH2DiNxUUQwQNSfH1RYwghphoCIGADQk1QKqAGCKhCKTKq6GWbYHSdvve9u7ee8cP210LAjrJ+XAmM78zOf8zcxT/bROBYuDRkX03cA1ofliSeoDfBFYAz2UZemFZXsBf6De9gkvbQCJx7k7/4LAjrUAtcBBI/B/wDGBL6Zhg0cZ5E8YvKswJ+zRl4LqIOOC6xBO2fbytJ7a1oS16sSveDGwG/ngYuEJXatOnT06f9ErJuEINUYgLrosK5CDiID2d4LogLrbtyDeX7rSu/631msBHwPE0SB9dqa5Uzf4V5SWrpuXna6AQAQREyFqzGWPWAuwzR0j7Fag5EV+oPOILHGjuni5wFugYDTaB7Z8vmTFj1bSC/DQMEbRIAZ6FK9BL5qGCYVSWD4m1I4N9mZhJj3j9OR5dP3azf/LIvbtp8AulY0LPbF86c6oCBQKAt7Ia8+VN6BNKQNPA8GJMKcNTsRKUwrl6LlN9aTgreLSt37o9ZHcDjWnwpi+eLp01NdcfSAd6lq7GU7ma5C+1WF9tQC+ajnS3M7TtNZTpw1tZDeLiXGnIXEvEq+sHW3pN4IABTDR1fdyiotxwRtFIAZ4lVSRP1pI4+CW4Ltb3NSnxhgaw9n4GCOazr2KfrsNtv5FSPt8fztLV+GFHHteA4vL8kN/vNYw02CirANcl+eO3GWWlL4b0xTL7RO0OEBdj/rKMz2doRmk42wcUa0BuYcjvBVA5EczXt6aCHRtzzQeoUG7qsLlLMeZWko7LeqMGsW28i1fie2cnWngsAIU+wwtENEBERO55z/zLcT+7T3uN5IkGdLX1xZMA0tOJ9fX72KfrULqOtXsL0tsFgH3maOoNj8QN73gPpRskftpH/JO1uLHbAETjdgLo1ICmhlu9gwMJ206fajfUg9LwLHvpn+KCYVQwoy/e5esAhX26LuMbTLr2hdhQHGjSgGbLcaInWroyykjXLZLH9uBZsBzv82+isv2Yq98lq3ojKjuAWfU2nsUrsQ7twu1oy4B/vj0YsxyJAi3pW6qaOSb01qnqJ8r09HwQwXiqCu/SF0EEsZOpyg0PKEXi0C6sw7vBcUBckrYjCw83nWvsGf4Y2JdukKvtg1ZFxGcG54wNhdIt7TRdwGmoR4b60QsmgpMkWb8X67sa7PMnMi0Nws5LndE913saga2MamkHuFjf3DF/dn4oUJzj86eTJN6He+08+pRypC+G9f221JwYNU+ORHs71v0avQxsANrh7unWJXBj/6Wb08LZHr00LxjU0nNDBOfyWewLJ2E4nqnSdlzZ+eed6NpTNy4LfEhqunEvGOAvoOFoc+fkuusdw3l+0ygMmKZXUxrDccRKQQcs2z7S2tO55vj1K3uaYo3A+tFQePDX5CH1NS03dTV+dl7Q91jANAWXaH/C+r2jPz6i/g8jK3kv4EHg0VYETOHuz/Qq0PKwpL8BL8EAdKaMj7AAAAAASUVORK5CYII="/>


        <!-- TODO: move all these extra map components into a single container to simplify their positioning -->
        <!-- TODO: hide these components while the map loading/reloading since they are poking through the loading screen  -->
        <!-- TODO: when RAMP api supports it, move them inside the ramp container  -->
        <!-- TODO: fidn a way to hide these when a help/export dialog or datatable is opened as they are pokinig through them -->
        <map-colour-ramp
            v-if="colourRamp"
            :labels="colourRamp.labels"
            :colours="colourRamp.colours">
        </map-colour-ramp>

        <time-slider
            v-if="timeSliderLabels">
        </time-slider>

        <map-fineprint
            :cursor-point="cursorPoint"></map-fineprint>
    </div>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';
import { mixins } from 'vue-class-component';

import sprintf from 'sprintf-js';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/throttleTime';

import api from './../api/';
import { MapPoint } from './../store/';
import { UpdateRouteMixin } from '../globals/mixin';

import { ColourRamp } from './../configs/datasets';

import TimeSlider from './time-slider.vue';
import MapColourRamp from './map-colour-ramp.vue';
import MapFineprint from './map-fineprint.vue';
import { ChartConfigGenerator } from './../configs/charts';
import { ChartConfigType, DatasetId } from '@/types';

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

@Component({
    components: {
        'time-slider': TimeSlider,
        'map-colour-ramp': MapColourRamp,
        'map-fineprint': MapFineprint
    }
})
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
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend (%(startYear)s-%(endYear)s): %(value)s</span></div>",
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
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (%(startYear)s-%(endYear)s): %(value)s</span></div>",
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
    @State zoomLevel: number;
    @State mapPin: MapPoint;

    @Action setFeatureId: (value: string) => void;
    @Action setCenterPoint: (value: { x: number; y: number }) => void;
    @Action setMapPin: (value: MapPoint | null) => void;
    @Action setCurrentView: (value: string) => void;
    @Action setFeaturePoint: (value: { x: number; y: number }) => void;
    @Action setZoomLevel: (value: number) => void;

    @Getter chartConfigGenerator: ChartConfigGenerator;
    @Getter timeSliderLabels: string[] | undefined;
    @Getter colourRamp: ColourRamp | null;
    @Getter datasetApi: any;

    // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
    counter = 0;

    currentLayers: any[];

    configVersion: number;

    @Watch('currentVariable')
    onVarChanged(newValue: string, oldValue: string) {
        this.currentLayers.forEach((layerId: string) => {
            this._mapi.layers.removeLayer(layerId);
        });
        this.addCurrentVarLayer();

        if (!this.currentFeature) {
            return;
        }
        this.displayMiniChart();
    }

    @Watch('currentRcp')
    onRcpChanged(newValue: string, oldValue: string) {
        this.currentLayers.forEach((layerId: string) => {
            this._mapi.layers.removeLayer(layerId);
        });
        this.addCurrentVarLayer();

        if (!this.currentFeature) {
            return;
        }
        this.displayMiniChart();
    }

    @Watch('currentTimePeriod')
    onTimePeriodChange() {
        this.displayMiniChart();
    }

    addCurrentVarLayer() {
        this.currentLayers = [];
        this.counter += 1;
        $.getJSON(`./assets/configs/${this.currentDataset}/${this.configVersion}/layer-configs.en-CA.json`, data => {
            let snippet = data[this.currentVariable];
            // for some datasets (like cmip5) we also have to select on rcp
            if (this.currentRcp) {
                snippet = snippet[this.currentRcp];
            }

            // loop through layer array, add each layer snippet to the map
            snippet.forEach((layer: any, index: number) => {
                if (index === this.timeSlice) {
                    layer.state.visibility = true;
                }

                // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
                layer.id += `_${this.counter}`;
                const addedLayer = this._mapi.layers.addLayer(layer);
                this.currentLayers[index] = layer.id;
            });
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

    @Watch('mapPin')
    onMapPinChanged(newValue: MapPoint): void {
        // HACK
        if (!newValue) {
            return;
        }
        window.setTimeout(() => this.setMapPin(newValue), 500);
        // HACK
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

    // id selectors for mini chart
    private miniChartSectionId: string = 'cip-mini-chart-section';
    private miniChartChartId: string = 'cip-mini-chart-chart';

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

        RZ.mapAdded.takeUntil(this.deactivate).subscribe((mapi: any) => {
            this._mapi = mapi;
            this.addCurrentVarLayer();

            // turn off default identify behaviour
            this._mapi.identify = false;

            // subscribe to Tooltips events
            this._mapi.ui.tooltip.mouseOver.takeUntil(this.deactivate).subscribe(this.tooltipMouseOverHandler);
            this._mapi.ui.tooltip.mouseOut.takeUntil(this.deactivate).subscribe(this.tooltipMouseOutHandler);

            // subscribe to the center change stream to update the url and store with the current center point
            this._mapi.centerChanged.subscribe(this.mapInstanceCenterChangedHandler);

            this._mapi.zoomChanged.subscribe(this.mapZoomChangedHandler);

            this._mapi.ui.anchors.CONTEXT_MAP.after(`
                <div id="cip-mini-chart-mount"></div>
            `);

            // set the identify mode to 'highlight' to prevent the details panel from opening
            if (this.currentDataset === DatasetId.AHCCD) {
                this._mapi.identifyMode = 'highlight';
            } else {
                this._mapi.identifyMode = 'silent';
            }
            // subscribe to identify events to track highlighted items
            this._mapi.layers.identify.subscribe(this.mapIdentifyHandler);

            this._mapi.mouseMove.throttleTime(30).subscribe((event: any) => {
                // TODO: remove when RAMP bug https://github.com/fgpv-vpgf/fgpv-vpgf/issues/2612 is fixed
                if (!event.xy) {
                    return;
                }

                this.cursorPoint = new MapPoint(event.xy.x, event.xy.y);
            });

            document.querySelector('.rv-esri-map')!.addEventListener('wheel', this.scrollGuardHandler, {
                capture: true
            });

            // if the current station is already set, open the mini chart
            if (this.currentFeature) {
                this.displayMiniChart();
            }

            if (this.zoomLevel) {
                this.onZoomLevelChanged();
            } else {
                this.mapZoomChangedHandler(this._mapi.zoom);
            }

            if (this.centerPoint) {
                this.onCenterPointChanged();
            } else {
                const center = this._mapi.center;

                this.mapInstanceCenterChangedHandler({ x: center.x, y: center.y });
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
    async mapIdentifyHandler({ requests, event }: IdentifySession) {
        if (requests.length === 0) {
            return;
        }

        // if the identify mode is silent that means we need to draw our own highlight
        if (this._mapi.identifyMode === 'silent') {
            // retrieve the geometry points from the api
            const { coordinates, gridId } = await this.datasetApi.getGeometryPoints(event.xy);

            // build the polygon
            const RZ = (<any>window).RZ;
            const line = new RZ.GEO.LinearRing(requests[0].sessionId, coordinates);
            const poly = new RZ.GEO.Polygon(requests[0].sessionId, [line]);

            //update drawn geometry
            this._mapi.simpleLayer.removeGeometry();
            this._mapi.simpleLayer.addGeometry([poly]);

            // update the route
            this.setFeaturePoint(event.xy);
            this.setFeatureId(gridId);
            this.updateRoute();

            //draw the minichart
            this.displayMiniChart();
        } else {
            requests[0].features.then((features: IdentifyResult[]) => {
                if (features.length === 0) {
                    return;
                }

                // if multiple features are received, leave only one
                features.splice(1);

                const feature = features[0].data.find(({ key }) => key === 'Station ID');
                const stationId = feature ? feature.value.toString() : '';

                // features.find(feature => )

                console.log(features);

                this.setFeaturePoint(event.xy);
                this.setFeatureId(stationId);
                this.updateRoute();

                this.displayMiniChart();
            });
        }
    }

    async displayMiniChart(): Promise<void> {
        console.log('display mini chart');

        // TODO: move the glance chart to the separate component
        const config = await this.chartConfigGenerator.make(ChartConfigType.GLANCE);
        const chartMount = document.getElementById('cip-mini-chart-mount');

        // if the mini-chart section is already create but dismounted, remount it
        const miniChartSection = api.DQV.sections[this.miniChartSectionId];
        if (miniChartSection) {
            if (!miniChartSection.isMounted) {
                miniChartSection.mount(chartMount);
            }

            // if the mini-chart is already loaded, update its config
            const miniChartChart = api.DQV.charts[this.miniChartChartId];
            miniChartChart.config = config;

            return;
        }

        // create the mini-chart
        // tslint:disable-next-line:no-unused-expression
        new api.DQV.Chart({ id: this.miniChartChartId, config });
        const dvsection = new api.DQV.Section({
            id: this.miniChartSectionId,
            data: {
                changeView: () => this.changeViewToChart(),
                dismountChart: () => dvsection.dismount()
            },
            template: `
                <dv-section class="cip-glance-chart-container">
                    <dv-chart id="${this.miniChartChartId}" role="button" @click.native="changeView"></dv-chart>
                    <button class="btn btn-link cip-close-button" @click="dismountChart" title="Close"><i class="fa fa-times"></i></button>
                </dv-section>
            `
        });

        dvsection.mount(chartMount);
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

    changeViewToChart(): void {
        this.setCurrentView('chart-view');
        this.updateRoute();
    }

    beforeDestroy(): void {
        // dismount the mini-chart DV section when the map component is reloaded
        const miniChartSection = api.DQV.sections[this.miniChartSectionId];
        if (miniChartSection) {
            miniChartSection.dismount();
        }

        // deactivate all subscriptions when the component is being destroyed
        this.deactivate.next(true);
        this.deactivate.unsubscribe();
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
            top: calc((100% - #{$rv-top-offset}) / 2 + #{$rv-top-offset}) !important;
            transform: translateY(-50%);
        }
    }

    .cip-time-slider-container {
        width: $container-width * 0.25;
        left: calc((#{$container-width} * 0.375) + #{$rv-left-offset});
        position: absolute;
        bottom: 20px;
    }

    .cip-glance-chart-container {
        .cip-close-button {
            font-size: 1em;
            position: absolute;
            top: 0;
            right: 0;
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

.colour-ramp {
    position: absolute;
    bottom: 120px;
    left: 760px;
}
</style>
