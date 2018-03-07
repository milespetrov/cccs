<template>

    <div id="cip-map-anchor">

        <div ref="scrollGuard" class="cip-scroll-guard">
            <p class="cip-label">Use ctrl + scroll to zoom the map</p>
        </div>

        <svg ref="fakeHighlight" class="cip-fake-highlight"></svg>

        <img v-if="mapPin" class="cip-fake-map-pin" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARuSURBVDiNjZVrbFRVEMd/5967e9vddbduN4WWYgXKKyVQWgIhkQBVqJIYCQZJI00UH2DiNxUUQwQNSfH1RYwghphoCIGADQk1QKqAGCKhCKTKq6GWbYHSdvve9u7ee8cP210LAjrJ+XAmM78zOf8zcxT/bROBYuDRkX03cA1ofliSeoDfBFYAz2UZemFZXsBf6De9gkvbQCJx7k7/4LAjrUAtcBBI/B/wDGBL6Zhg0cZ5E8YvKswJ+zRl4LqIOOC6xBO2fbytJ7a1oS16sSveDGwG/ngYuEJXatOnT06f9ErJuEINUYgLrosK5CDiID2d4LogLrbtyDeX7rSu/631msBHwPE0SB9dqa5Uzf4V5SWrpuXna6AQAQREyFqzGWPWAuwzR0j7Fag5EV+oPOILHGjuni5wFugYDTaB7Z8vmTFj1bSC/DQMEbRIAZ6FK9BL5qGCYVSWD4m1I4N9mZhJj3j9OR5dP3azf/LIvbtp8AulY0LPbF86c6oCBQKAt7Ia8+VN6BNKQNPA8GJMKcNTsRKUwrl6LlN9aTgreLSt37o9ZHcDjWnwpi+eLp01NdcfSAd6lq7GU7ma5C+1WF9tQC+ajnS3M7TtNZTpw1tZDeLiXGnIXEvEq+sHW3pN4IABTDR1fdyiotxwRtFIAZ4lVSRP1pI4+CW4Ltb3NSnxhgaw9n4GCOazr2KfrsNtv5FSPt8fztLV+GFHHteA4vL8kN/vNYw02CirANcl+eO3GWWlL4b0xTL7RO0OEBdj/rKMz2doRmk42wcUa0BuYcjvBVA5EczXt6aCHRtzzQeoUG7qsLlLMeZWko7LeqMGsW28i1fie2cnWngsAIU+wwtENEBERO55z/zLcT+7T3uN5IkGdLX1xZMA0tOJ9fX72KfrULqOtXsL0tsFgH3maOoNj8QN73gPpRskftpH/JO1uLHbAETjdgLo1ICmhlu9gwMJ206fajfUg9LwLHvpn+KCYVQwoy/e5esAhX26LuMbTLr2hdhQHGjSgGbLcaInWroyykjXLZLH9uBZsBzv82+isv2Yq98lq3ojKjuAWfU2nsUrsQ7twu1oy4B/vj0YsxyJAi3pW6qaOSb01qnqJ8r09HwQwXiqCu/SF0EEsZOpyg0PKEXi0C6sw7vBcUBckrYjCw83nWvsGf4Y2JdukKvtg1ZFxGcG54wNhdIt7TRdwGmoR4b60QsmgpMkWb8X67sa7PMnMi0Nws5LndE913saga2MamkHuFjf3DF/dn4oUJzj86eTJN6He+08+pRypC+G9f221JwYNU+ORHs71v0avQxsANrh7unWJXBj/6Wb08LZHr00LxjU0nNDBOfyWewLJ2E4nqnSdlzZ+eed6NpTNy4LfEhqunEvGOAvoOFoc+fkuusdw3l+0ygMmKZXUxrDccRKQQcs2z7S2tO55vj1K3uaYo3A+tFQePDX5CH1NS03dTV+dl7Q91jANAWXaH/C+r2jPz6i/g8jK3kv4EHg0VYETOHuz/Qq0PKwpL8BL8EAdKaMj7AAAAAASUVORK5CYII="/>

    </div>
    
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';
import { mixins } from 'vue-class-component';

import sprintf from 'sprintf-js';
import { Subject } from 'rxjs/Subject';

import api from './../api/main';
import ahccdTemp from '../configs/chart/ahccd-temp';
import { MapPoint } from './../store/';
import { UpdateRouteMixin } from '../globals/mixin';

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
    @State centerPoint: MapPoint;
    @State zoomLevel: number;
    @State mapPin: MapPoint;

    @Action setFeatureId: (value: string) => void;
    @Action setCenterPoint: (value: { x: number; y: number }) => void;
    @Action setMapPin: (value?: MapPoint) => void;
    @Action setCurrentView: (value: string) => void;
    @Action setFeaturePoint: (value: { x: number; y: number }) => void;

    // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
    counter = 0;

    @Watch('currentVariable')
    onVarChanged(newValue: string, oldValue: string) {
        this._mapInstance.layers.removeLayer(
            // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
            `${this.currentDataset}_${oldValue}_${this.counter}`
        );
        this.addCurrentVarLayer();
    }

    addCurrentVarLayer() {
        this.counter += 1;
        $.getJSON(`./assets/configs/${this.currentDataset}-layer-configs.en-CA.json`, data => {
            const snippet = data[this.currentVariable];
            // TODO (HACK): Remove counter once layer re-adding bug is fixed on RAMP
            snippet.id = `${this.currentDataset}_${this.currentVariable}_${this.counter}`;
            this._mapInstance.layers.addLayer(snippet);
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
        if (!this._mapInstance) {
            return;
        }

        if (this.localCenterPointUpdate) {
            this.localCenterPointUpdate = false;
            return;
        }

        const xyCenter = new api.RZ.GEO.XY(this.centerPoint.x, this.centerPoint.y);
        this._mapInstance.setCenter(xyCenter);
    }

    @Watch('zoomLevel')
    onZoomLevelChanged(): void {
        this._mapInstance.zoom = this.zoomLevel;
    }

    localCenterPointUpdate: boolean = false;

    _mapInstance: any;

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

    // #region HACKS

    realLayer: JQuery<HTMLElement>;
    fhDownS: any;
    fhMoveS: any;

    setFakeHighlight(event: MouseEvent): void {
        if ((<HTMLElement>event.target).tagName !== 'image') {
            this.clearFakeHighlight();
            return;
        }

        if (!this.realLayer) {
            this.realLayer = $('.esriMapLayers > svg').first();
        }

        this.clearFakeHighlight();

        const transform = this.realLayer.css('transform');
        this.realLayer.find('> g').css('opacity', 0.25);

        const fg = <HTMLElement>this.$refs.fakeHighlight;
        fg.style.transform = transform;

        const clone = (<HTMLElement>event.target).cloneNode() as HTMLElement;
        fg.appendChild(clone);

        this.fhDownS = this._mapInstance.mouseDown.subscribe(
            (eventDown: MouseEvent) =>
                (this.fhMoveS = this._mapInstance.mouseMove.subscribe((eventMove: MouseEvent) => {
                    if (eventDown.screenX !== eventMove.screenX || eventDown.screenY !== eventMove.screenY) {
                        this.clearFakeHighlight();
                    }
                }))
        );
    }

    clearFakeHighlight(): void {
        this.setMapPin();

        if (this.fhDownS) {
            this.fhDownS.unsubscribe();
        }
        if (this.fhMoveS) {
            this.fhMoveS.unsubscribe();
        }
        if (this.realLayer) {
            this.realLayer.find('> g').css('opacity', 1);
        }

        const fh = this.$refs.fakeHighlight as HTMLElement;

        while (fh.firstChild) {
            fh.removeChild(fh.firstChild);
        }
    }

    // #endregion HACKS

    mounted(): void {
        const RZ = (<any>window).RZ;

        // if RAMP API is not ready yet, loop-wait until it's loaded
        if (!RZ) {
            window.setTimeout(() => this.mounted(), 500);
            return;
        }

        if (this.currentVariable === null || this.currentDataset === null) {
            console.log('cannot create the map - either variable or dataset is not set');
            return;
        }

        // TODO: remove HACKS
        // temporary click feature highlight
        this.clearFakeHighlight();
        this.$el.addEventListener('click', this.setFakeHighlight);
        // end TODO: remove HACKS

        // tslint:disable-next-line:no-unused-expression
        new RZ.Map(this.anchor, `./assets/configs/${this.currentDataset}.en-CA.json`);

        RZ.mapAdded.takeUntil(this.deactivate).subscribe((mapi: any) => {
            this._mapInstance = mapi;
            this.addCurrentVarLayer();

            // turn off default identify behaviour
            this._mapInstance.identify = false;

            // subscribe to Tooltips events
            this._mapInstance.ui.tooltip.mouseOver.takeUntil(this.deactivate).subscribe(this.tooltipMouseOverHandler);

            this._mapInstance.ui.tooltip.mouseOut.takeUntil(this.deactivate).subscribe(this.tooltipMouseOutHandler);

            // subscribe to the center change stream to update the url and store with the current center point
            this._mapInstance.centerChanged.subscribe(this.mapInstanceCenterChangedHandler);

            this._mapInstance.ui.anchors.CONTEXT_MAP.after(`
                <div id="cip-mini-chart-mount"></div>
            `);

            // subscribe to map click events to track clicks on features
            // TODO: this will change when API allows listening on individual layers
            this._mapInstance.click.takeUntil(this.deactivate).subscribe(this.mapInstanceClickHandler);

            document.querySelector('.rv-esri-map')!.addEventListener('wheel', this.scrollGuardHandler, {
                capture: true
            });

            if (this.centerPoint) {
                this._mapInstance.setCenter(this.centerPoint);
            } else {
                const center = this._mapInstance.center;

                const xyCenter = new api.RZ.GEO.XY(center.x, center.y);

                this.mapInstanceCenterChangedHandler(xyCenter);
            }
        });
    }

    // HACKS
    mapCenter: any = { x: -1, y: -1 };

    mapInstanceCenterChangedHandler(event: any): void {
        // TODO: remove HACKS
        // centerChange seems to fire
        if (this.mapCenter.x !== event.x || this.mapCenter.y !== event.y) {
            //this.mapCenter = event;
        } else {
            return;
        }

        this.clearFakeHighlight();
        // end TODO: remove HACKS

        this.localCenterPointUpdate = true;

        this.setCenterPoint(event);
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

    mapInstanceClickHandler(event: any): void {
        event.features
            .debounceTime(20)
            .takeUntil(this.deactivate)
            .subscribe((features: any) => {
                const stationId = features.data.find(
                    (attrib: any) => attrib.key === 'stnid' || attrib.key === 'Station ID'
                )!.value;

                this.setFeaturePoint(event.xy);
                this.setFeatureId(stationId);
                this.updateRoute();

                this.displayMiniChart(stationId);
            });
    }

    async displayMiniChart(stationId: string): Promise<void> {
        console.log('display mini chart');

        // TODO: abstract data retrieval to a single place
        const data = await api.getData(this.currentTimePeriod, this.currentVariable, this.currentDataset, stationId);

        const config = ahccdTemp(data, this.currentTimePeriod, this.currentVariable, <any>stationId, {}, true);

        console.log(config);

        // if the mini-chart is already loaded, update its config
        const miniChartChart = api.DQV.charts[this.miniChartChartId];
        if (miniChartChart) {
            miniChartChart.config = config;
            return;
        }

        // create the mini-chart
        // tslint:disable-next-line:no-unused-expression
        new api.DQV.Chart({ id: this.miniChartChartId, config });
        const dvsection = new api.DQV.Section({
            id: this.miniChartSectionId,
            template: `<dv-section><dv-chart id="${this.miniChartChartId}"></dv-chart></dv-section>`
        });

        /* this._mapInstance.ui.anchors.CONTEXT_MAP.html(`
            <div class="mApiOverViewMap">
                <div id="cip-mini-chart-mount"></div>
            </div>
        `); */

        const chartMount = document.getElementById('cip-mini-chart-mount');
        dvsection.mount(chartMount);

        // TODO: fix, this is likely accumulating click listeners
        const chartSection = document.getElementById('cip-mini-chart-section')!;
        chartSection.setAttribute('tabIndex', '-1');
        chartSection.addEventListener('click', this.changeViewToChart);

        // seems that you need to subscribe every time after setting the guts of the context map node
        // TODO: fix; since we not using the mini map container, the subsscription won't work
        /* this._mapInstance.ui.anchors.CONTEXT_MAP.on(
            'click',
            this.changeViewToChart
        ); */
    }

    scrollGuardHandler(event: WheelEvent): void {
        if (!this._mapInstance) {
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
            this._mapInstance._fgpMap._map.disableScrollWheelZoom();

            scrollGuardClassList.remove('cip-scrolling');
            scrollGuardClassList.add('cip-active');

            // proper use of timeout
            // remove scroll guard notification after two seconds
            window.setTimeout(() => scrollGuardClassList.remove('cip-active'), 2000);
        } else {
            scrollGuardClassList.remove('cip-active');
            scrollGuardClassList.add('cip-scrolling');

            this._mapInstance._fgpMap._map.enableScrollWheelZoom();
        }
    }

    changeViewToChart(): void {
        this.setCurrentView('chart-view');
        this.updateRoute();
    }

    beforeDestroy(): void {
        // destroy the mini-chart DV section when the map component is reloaded
        const miniChartSection = api.DQV.sections[this.miniChartSectionId];
        if (miniChartSection) {
            miniChartSection.destroy();
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

    .cip-fake-highlight {
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

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

        // z-index: 2;
        position: absolute;
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

        $rv-top-offset: $top-navigation-height + $page-header-height + $view-controls-height;

        .cip-label {
            font-size: 1em * 1.5;
            color: white;
            position: relative;
            margin: 0;
            top: calc((100% - #{$rv-top-offset}) / 2 + #{$rv-top-offset}) !important;
            transform: translateY(-50%);
        }
    }
}
</style>
