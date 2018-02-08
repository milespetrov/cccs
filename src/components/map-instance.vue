<template>
    <div id="map-anchor">

        <span></span>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';

import sprintf from 'sprintf-js';
import { Subject } from 'rxjs/Subject';

import api from './../api/main';
import ahccdTemp from '../configs/chart/ahccd-temp';
import { CenterPoint } from './../store/';

interface tooltips {
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
export default class MapInstance extends Vue {
    tooltipTemplates: tooltips = {
        'en-CA': {
            ahccd: {
                tmean: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                },
                tmin: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                },
                tmax: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                },
                precip: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                }
            }
        },
        'fr-CA': {
            ahccd: {
                tmean: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                },
                tmin: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                },
                tmax: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                },
                precip: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                }
            }
        }
    };

    get anchor(): HTMLElement {
        return document.getElementById('map-anchor')!;
    }

    @State('variableId') currentVariable: string;
    @State('datasetId') currentDataset: string;
    @State('timePeriodId') currentTimePeriod: string;
    @State('stationId') currentStation: string;
    @State centerPoint: CenterPoint;

    @Getter getQuery: Dictionary<string>;

    @Action setStationId: (value: string) => void;
    @Action setCenterPoint: (value: { x: number; y: number }) => void;

    @Watch('centerPoint')
    onCenterPointChanged(
        newValue: CenterPoint | null,
        oldValue: CenterPoint | null
    ): void {
        if (!this.mapInstance) {
            return;
        }

        if (this.localCenterPointUpdate) {
            this.localCenterPointUpdate = false;
            return;
        }

        const XYcenter = new api.RZ.GEO.XY(
            this.centerPoint.x,
            this.centerPoint.y
        );
        this.mapInstance.setCenter(XYcenter);
    }

    localCenterPointUpdate: boolean = false;

    mapInstance: any = null;

    deactivate: Subject<boolean> = new Subject<boolean>();

    // id selectors for mini chart
    private miniChartSectionId: string = 'cip-mini-chart-section';
    private miniChartChartId: string = 'cip-mini-chart-chart';

    // TODO: link to a language choice; property, or stored value, or button
    lang: string = 'en-CA';

    // TODO: link once dataSet selector is finalized
    dataSet: string = 'ahccd';

    mounted(): void {
        let RZ = (<any>window).RZ;

        // if RAMP API is not ready yet, loop-wait until it's loaded
        if (!RZ) {
            window.setTimeout(() => this.mounted(), 500);
            return;
        }

        if (this.currentVariable === null || this.currentDataset === null) {
            console.log(
                'cannot create the map - either variable or dataset is not set'
            );
            return;
        }

        new RZ.Map(
            this.anchor,
            `./assets/configs/config-${
                this.currentDataset
            }-${this.currentVariable.replace(/_/g, '-')}.en-CA.json`
        );

        let tooltip;
        RZ.mapAdded.takeUntil(this.deactivate).subscribe((mapi: any) => {
            this.mapInstance = RZ.mapInstances[RZ.mapInstances.length - 1];

            // turn off default identify behaviour
            this.mapInstance.identify = false;

            // subscribe to tooltips events
            this.mapInstance.ui.tooltip.mouseOver
                .takeUntil(this.deactivate)
                .subscribe(this.tooltipMouseOverHandler);

            this.mapInstance.ui.tooltip.mouseOut
                .takeUntil(this.deactivate)
                .subscribe(this.tooltipMouseOutHandler);

            // subscribe to the center change stream to update the url and store with the current center point
            this.mapInstance.centerChanged.subscribe(
                this.mapInstanceCenterChangedHanlder
            );

            this.mapInstance.ui.anchors.CONTEXT_MAP.after(`
                <div id="cip-mini-chart-mount"></div>
            `);

            // subscribe to map click events to track clicks on features
            // TODO: this will change when API allows listening on individual layers
            this.mapInstance.click
                .takeUntil(this.deactivate)
                .subscribe(this.mapInstanceClickHandler);

            // if the current station is already set, open the mini chart
            if (this.currentStation) {
                this.displayMiniChart(this.currentStation);
            }

            if (this.centerPoint) {
                this.mapInstance.setCenter(this.centerPoint);
            }
        });
    }

    mapInstanceCenterChangedHanlder(event: any): void {
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

            const currentTemplate = this.tooltipTemplates[this.lang][
                this.dataSet
            ][this.currentVariable!];

            const name = a.station_name_nom;
            let value = Intl.NumberFormat(this.lang).format(
                a[currentTemplate.value_key]
            );

            if (parseFloat(value) > 0) {
                value = '+' + value;
            }

            tooltip = z.add(
                sprintf.sprintf(currentTemplate.template, <any>{
                    name,
                    value
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
                const station_id = features.data.find(
                    (attrib: any) =>
                        attrib.key === 'stnid' || attrib.key === 'Station ID'
                )!.value;

                this.displayMiniChart(station_id);
            });
    }

    async displayMiniChart(station_id: string): Promise<void> {
        console.log('display mini chart');

        this.setStationId(station_id);
        this.updateRoute();

        // TODO: abstract data retrieval to a single place
        const data = await api.getData(
            this.currentTimePeriod,
            this.currentVariable,
            this.currentDataset,
            station_id
        );

        const config = ahccdTemp(
            data,
            this.currentTimePeriod,
            this.currentVariable,
            <any>station_id,
            true
        );

        console.log(config);

        // if the mini-chart is already loaded, update its config
        const miniChartChart = api.DQV.charts[this.miniChartChartId];
        if (miniChartChart) {
            miniChartChart.config = config;
            return;
        }

        // create the mini-chart
        new api.DQV.Chart({ id: this.miniChartChartId, config });
        const dvsection = new api.DQV.Section({
            id: this.miniChartSectionId,
            template: `<dv-section><dv-chart id="${
                this.miniChartChartId
            }"></dv-chart></dv-section>`
        });

        /* this.mapInstance.ui.anchors.CONTEXT_MAP.html(`
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
        /* this.mapInstance.ui.anchors.CONTEXT_MAP.on(
            'click',
            this.changeViewToChart
        ); */
    }

    changeViewToChart(): void {
        this.$router.push({
            name: 'chart-view',
            query: this.getQuery
        });
    }

    updateRoute(): void {
        this.$router.push({
            name: this.$router.currentRoute.name,
            query: this.getQuery
        });
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

#map-anchor {
    /* right: 0;
    left: 0;
    width: 100%; */
    height: $backdrop-map-height;
    // position: absolute;
}
</style>
