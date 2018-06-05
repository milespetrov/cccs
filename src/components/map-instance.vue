<template>

    <div id="cip-map-anchor" :class="currentDataset">
        <div id="minichart"></div>

        <div class="cip-scroll-guard" ref="scrollGuard">
            <p class="cip-label">Use ctrl + scroll to zoom the map</p>
        </div>

        <!-- TODO: move all these extra map components into a single container to simplify their positioning -->
        <!-- TODO: hide these components while the map loading/reloading since they are poking through the loading screen  -->
        <!-- TODO: when RAMP api supports it, move them inside the ramp container  -->
        <!-- TODO: fidn a way to hide these when a help/export dialog or datatable is opened as they are pokinig through them -->

        <div class="cip-control-cluster" v-if="timeSliderLabels || colourRamp || legend">

             <div class="row" v-if="legend">
                <div class="col-md-4">
                    <span class="cip-label">AHCCD Station:</span>
                </div>
                <div class="col-md-8">
                    <span v-html="legend[currentVariable]"></span>
                </div>
            </div>

            <div class="row" v-if="timeSliderLabels">
                <div class="col-md-4">
                    <span class="cip-label">Timeline:</span>
                </div>
                <div class="col-md-8">
                    <time-slider></time-slider>
                </div>
            </div>

            <!-- remove seprator if only one section is visible -->
            <span class="cip-separator-vertical" v-if="colourRamp"></span>

            <div class="row" v-if="colourRamp">
                <div class="col-md-4">
                    <span class="cip-label">{{ $t(`variableSelector.${currentVariable}.shortName`) }} change ({{$t(`units.${currentVariable}.shortName`)}}):</span>
                </div>
                <div class="col-md-8">
                    <map-colour-ramp
                        :labels="colourRamp.labels"
                        :colours="colourRamp.colours">
                    </map-colour-ramp>
                </div>
            </div>
        </div>

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

import { race } from 'rxjs/observable/race';

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
    @Action setCurrentView: (value: string) => void;
    @Action setFeaturePoint: (value: { x: number; y: number } | null) => void;
    @Action setZoomLevel: (value: number) => void;
    @Action setTileInfo: (value: number[] | null) => void;

    @Getter chartConfigGenerator: ChartConfigGenerator;
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

        if (!this.currentFeature) {
            return;
        }
        this.displayMiniChart();
    }

    /**
     * Updates the current legend based on the selected variable and its dataset.
     */
    async updateLegend(): Promise<void> {
        const legends: { [name: string]: object[] } = await $.getJSON(
            `./assets/configs/${this.currentDataset}/${this.configVersion}/legend.json`
        );

        // TODO: update legend settings layers and link them to actual reference layers
        let legend = legends[this.currentVariable];
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

        if (!this.currentFeature) {
            return;
        }
        this.displayMiniChart();
    }

    @Watch('currentTimePeriod')
    onTimePeriodChange() {
        this.switchLayers();

        if (!this.currentFeature) {
            return;
        }
        this.displayMiniChart();
    }

    //async addCurrentVarLayer() {
    async switchLayers(emptyMap?: boolean) {
        if (!emptyMap) {
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

        // no need to update the mini-chart on timeslice change since the chart includes the data for the entire time range
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

        RZ.mapAdded.takeUntil(this.deactivate).subscribe(async (mapi: any) => {
            this._mapi = mapi;

            this.switchLayers(true);

            // move cluster directly after the map so tab order is preserved
            $('.cip-control-cluster')
                .first()
                .insertAfter('rv-shell');

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
                // subscribe to identify events to track highlighted items
                this._mapi.layers.identify.subscribe(this.pointIdentifyHandler);
            } else {
                this._mapi.identifyMode = 'silent';
                this._mapi.click.subscribe(this.gridIdentifyHandler);
            }

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
            if (this.currentFeature && this._mapi.identifyMode !== 'silent') {
                this.displayMiniChart();
            } else if (this.featurePoint) {
                await this.drawGrid(this.featurePoint, -1);

                // draw the minichart
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

            this.displayMiniChart();
        });
    }

    async gridIdentifyHandler(event: any) {
        // draw the minichart, without the actual chart
        // the loading indicator will show up
        this.displayMiniChart(false);

        await this.drawGrid(event.xy, 0);

        // draw the minichart
        this.displayMiniChart();
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

    // if showChart is `false`, the chart box will drawn with loading animation
    // TODO: move the glance chart to the separate component
    async displayMiniChart(showChart: boolean = true): Promise<void> {
        console.log('display mini chart');

        const chartMount = document.getElementById('minichart');

        let miniChartSection = api.DQV.sections[this.miniChartSectionId];
        let miniChartChart = api.DQV.charts[this.miniChartChartId];

        if (miniChartSection) {
            // if mini chart section exist, the mini chart chart will exist as well
            // reset the config before remounting; otherwise it will remount with the old config
            miniChartChart.config = null;

            // if the mini-chart section is already create but dismounted, remount it
            if (!miniChartSection.isMounted) {
                miniChartSection.mount(chartMount);
            }
        } else {
            // create the mini-chart
            // tslint:disable-next-line:no-unused-expression
            miniChartChart = new api.DQV.Chart({ id: this.miniChartChartId });
            miniChartSection = new api.DQV.Section({
                id: this.miniChartSectionId,
                data: {
                    changeView: () => this.changeViewToChart(),
                    dismountChart: () => {
                        miniChartSection.dismount();
                        this.removeGridHighlight();
                    }
                },
                // https://stephanwagner.me/only-css-loading-spinner ??
                // http://tobiasahlin.com/spinkit/ ??
                template: `
                    <dv-section class="cip-glance-chart-container">
                        <dv-chart id="${this.miniChartChartId}" role="button" @click.native="changeView">

                            <div class="cip-spinner" >
                                <div class="sk-circle">
                                    <div class="sk-circle1 sk-child"></div>
                                    <div class="sk-circle2 sk-child"></div>
                                    <div class="sk-circle3 sk-child"></div>
                                    <div class="sk-circle4 sk-child"></div>
                                    <div class="sk-circle5 sk-child"></div>
                                    <div class="sk-circle6 sk-child"></div>
                                    <div class="sk-circle7 sk-child"></div>
                                    <div class="sk-circle8 sk-child"></div>
                                    <div class="sk-circle9 sk-child"></div>
                                    <div class="sk-circle10 sk-child"></div>
                                    <div class="sk-circle11 sk-child"></div>
                                    <div class="sk-circle12 sk-child"></div>
                                </div>
                            </div>

                        </dv-chart>

                        <button class="btn btn-link cip-close-button" @click="dismountChart" title="Close"><i class="fa fa-times"></i></button>
                    </dv-section>
                `
            });

            miniChartSection.mount(chartMount);
        }

        if (!showChart) {
            return;
        }

        // wait for the chart config to be created or 300 milliseconds, whicever is longer
        // 300 is needed for a smooth fade in/out animation
        const [config] = await Promise.all([
            this.chartConfigGenerator.make(ChartConfigType.GLANCE),
            new Promise(resolve => window.setTimeout(resolve, 300))
        ]);

        // update the glance chart with this config
        miniChartChart.config = config;
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
        if (!this._mapi) {
            return;
        }
        const centerExtent = this._mapi._fgpMap.extent.getCenter();
        // let res = 529.1677250021168; // 8
        // let res = 926.0435187537042; // 7
        const res = 7937.5158750317505; // 3
        const xorigin = -34655800;
        const yorigin = 39310000;

        // TODO: clean up magic numbers

        const tx = (centerExtent.x - xorigin) / 256 / res;
        const ty = (-centerExtent.y + yorigin) / 256 / res;

        this.setTileInfo([tx, ty]);
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

    removeGridHighlight(): void {
        // TODO: AHCCD must be handled differently, it does not use geometry drawing
        // remove any geometry drawn on the map
        this._mapi.simpleLayer.removeGeometry();
        // clear the feature from the store + route
        this.setFeatureId(null);
        this.setFeaturePoint(null);
        this.updateRoute();
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

    .cip-control-cluster {
        padding: 0.5rem 0;

        position: absolute;
        bottom: calc(#{$rv-bottom-offset} + 1rem);
        left: $container-width / 4;
        width: $container-width / 2;

        background-color: #fff;

        // TODO: create a shared variable for the box-shadow
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
            0px 3px 1px -2px rgba(0, 0, 0, 0.12);

        .row {
            margin: 0;
            min-height: 2.5rem;
            display: flex;
            align-items: center;

            .cip-label {
                font-size: 0.8em;
                display: inline-block;
                line-height: normal;
            }
        }
    }

    .cip-glance-chart-container {
        background-color: #fff;

        .cip-spinner {
            position: absolute;

            display: flex;
            align-items: center;
            justify-content: center;

            width: 100%;
            height: 100%;
            left: 0;
            top: 0;

            pointer-events: none;
        }

        [dv-chart] {
            cursor: pointer;

            // TODO: move to sass variable file
            width: 250px;
            height: 130px;

            &.dv-loading {
                cursor: none;

                [dv-chart-container] {
                    opacity: 0;
                }

                .cip-spinner {
                    opacity: 1;
                }
            }
        }

        [dv-chart-container] {
            opacity: 1;
        }

        .cip-spinner {
            opacity: 0;
        }

        [dv-chart-container],
        .cip-spinner {
            transition: opacity 0.3s ease-in-out;
        }

        .cip-close-button {
            font-size: 1em;
            position: absolute;
            top: 0;
            right: 0;
        }
    }

    .sk-circle {
        width: 4rem;
        height: 4rem;
        position: relative;

        .sk-child {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
        }
        .sk-child:before {
            content: '';
            display: block;
            margin: 0 auto;
            width: 15%;
            height: 15%;
            background-color: #333;
            border-radius: 100%;
            animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
        }

        @for $i from 2 through 12 {
            .sk-circle#{$i} {
                transform: rotate(0deg + 30deg * ($i - 1));

                &:before {
                    animation-delay: -1.2s + ($i - 1) * 0.1s;
                }
            }
        }
    }

    @keyframes sk-circleBounceDelay {
        0%,
        80%,
        100% {
            transform: scale(0);
        }
        40% {
            transform: scale(1);
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

// TODO: make a divider a shared component
.cip-separator-vertical {
    width: 100%;
    height: 1px;
    display: block;
    background: rgba(0, 0, 0, 0.15);
    margin: 0.5rem 0;
}
</style>
