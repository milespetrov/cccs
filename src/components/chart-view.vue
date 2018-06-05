<template>
    <div class="cip-chart-view">
            <div class="cip-view-toggle" @click="changeViewToMap">
                <div class="cip-map-button"
                    :style="tileStyle">
                    <img :src="`${ tileUrl }/3/${ tileCoordinates.y }/${ tileCoordinates.x }`" alt="">
                    <img :src="`${ tileUrl }/3/${ tileCoordinates.y }/${ tileCoordinates.x + 1 }`" alt="">
                    <img :src="`${ tileUrl }/3/${ tileCoordinates.y + 1 }/${ tileCoordinates.x }`" alt="">
                    <img :src="`${ tileUrl }/3/${ tileCoordinates.y + 1 }/${ tileCoordinates.x + 1 }`" alt="">
                </div>

                <span class="cip-view-toggle-label">click to see the full map</span>
            </div>

        <p>The data consists of monthly, seasonal and annual means of homogenized daily maximum, minimum and mean surface air temperatures for more than 330 locations in Canada; monthly, seasonal and annual totals of adjusted daily rainfall, snowfall and total precipitation for more than 460 locations; homogenized monthly, seasonal and annual means of hourly surface wind speed at more than 110 locations; monthly, seasonal and annual means of hourly station and sea level pressure adjusted for more than 630 locations. The data are given for the entire period of observation. Please refer to the papers below for detailed information regarding the procedures for homogenization and adjustment.</p>

        <div v-if="false">
            <b-dropdown id="ddown1" text="Dropdown Button" class="m-md-2" right>
                <b-dropdown-item>First Action</b-dropdown-item>
                <b-dropdown-item>Second Action</b-dropdown-item>
                <b-dropdown-item>Third Action</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item>Something else here...</b-dropdown-item>
                <b-dropdown-item disabled>Disabled action</b-dropdown-item>
            </b-dropdown>
        </div>

        <div id="mount-point"></div>

        <!-- Selected variable: {{ currentVariable }} <br>
        Selected dataset: {{ currentDataset }} <br>
        Selected time period: {{ currentTimePeriod }}<br> -->

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';

import api from './../api';
import { mixins } from 'vue-class-component/lib/util';
import { UpdateRouteMixin } from '../globals/mixin';

import { ChartConfigGenerator } from '../configs/charts';
import { ChartConfigType, ViewType } from '@/types';

@Component
export default class ChartView extends mixins(UpdateRouteMixin) {
    @Action setCurrentView: (value: ViewType) => void;
    @Action setChartRange: (value: { min: number; max: number } | null) => void;

    @Action setChartSeries: (visible: number[]) => void;
    @State chartSeries: number[];

    @Getter chartConfigGenerator: ChartConfigGenerator;

    @State('timePeriodId') currentTimePeriod: string;

    @Watch('currentTimePeriod')
    onTimePeriodChanged(): void {
        this.updateDQV();
    }

    @State('variableId') currentVariable: string;

    @Watch('currentVariable')
    onCurrentVariableChanged(): void {
        this.updateDQV();
    }

    @State('datasetId') currentDataset: string;

    @State('featureId') currentFeature: string;

    @Watch('currentFeature')
    onCurrentFeatureChanged(): void {
        this.updateDQV();
    }

    @State('rcpId') currentRcp: string;

    @Watch('currentRcp')
    onRcpChanged(): void {
        this.updateDQV();
    }

    @State tileInfo: number[];
    @Watch('tileInfo')
    onTilesChanged(): void {
        const dx = (this.tileInfo[0] % 1) * 256 + (this.tileInfo[0] % 1 > 0.5 ? 0 : 256) - 250 / 2;
        const dy = (this.tileInfo[1] % 1) * 256 + (this.tileInfo[1] % 1 > 0.5 ? 0 : 256) - 130 / 2;

        this.tileStyle = {
            transform: `translate(${-dx + 'px'}, ${-dy + 'px'})`
        };

        const tx = this.tileInfo[0] + (this.tileInfo[0] % 1 > 0.5 ? 0 : -1);
        const ty = this.tileInfo[1] + (this.tileInfo[1] % 1 > 0.5 ? 0 : -1);

        this.tileCoordinates = {
            x: Math.floor(tx),
            y: Math.floor(ty)
        };
    }

    tileUrl: string = 'http://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT3978/MapServer/tile';
    tileCoordinates: { x: number; y: number } = { x: 0, y: 0 };
    tileStyle: any = { transform: 'translate(0px, 0px)' };

    private userTrendValue: SVGElement;

    /**
     * Keeps track of the internal state of the view. When `false`, no update should be initiated inside the component.
     */
    isActive: boolean = false;

    /**
     * `Activated` lifecycle hook.
     * https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
     */
    activated(): void {
        this.isActive = true;

        // trigger data update change
        this.updateDQV();
    }

    /**
     * `Activated` lifecycle hook.
     * https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
     */
    deactivated(): void {
        this.isActive = false;
    }

    data: any;

    async mounted(): Promise<void> {
        if (!this.data) {
            const config = await this.chartConfigGenerator.make(ChartConfigType.FOCUS, this.callbacks);
            this.initDQV(config);
            return;
        }
    }

    initDQV(config: object): void {
        const data = {
            name: 'foobar',
            isTable: true
        };

        const template = `
            <dv-section>
                <dv-chart id="dvChart1" dv-auto-generate-table>
                    <details>
                        <summary @click="window.wb.add('table')">View data for this chart</summary>
                        <div class="summary">
                            <dv-chart-table v-show="isTable" dv-auto-render dv-table-class="wb-tables table table-striped"></dv-chart-table>
                            <div v-show="!isTable"> Enable a data series to show the table. </div>
                        </div>
                    </details>
                </dv-chart>
            </dv-section>
        `;

        const dvchart1 = new api.DQV.Chart({
            id: 'dvChart1',
            config
        });
        const dvsection1 = new api.DQV.Section({
            id: 'dvSection1',
            template,
            data
        });

        // window.setTimeout(() => {
        dvsection1.mount(document.getElementById('mount-point'));
        // }, 2000);

        // (<any>window).wb.add('summary');
        /* (<any>window).wb.add('table'); */
    }

    async updateDQV(): Promise<void> {
        if (!this.isActive) {
            return;
        }

        const config = await this.chartConfigGenerator.make(ChartConfigType.FOCUS, this.callbacks);

        const chartId = 'dvChart1';
        const dvChart = api.DQV.charts[chartId];
        dvChart.config = config;

        // (<any>window).wb.add('summary');
        //(<any>window).wb.add('table');
    }

    /**
     * Used to add callbacks to the chart config;
     * Add the function here then call it within the config event
     */

    callbacks = {
        setExtremes: (event: any) => {
            // handles the 'reset zoom' button
            // TODO: figure out why 'reset zoom' passes back undefined values
            if (!event.min || !event.max) {
                this.setChartRange(null);
            } else {
                this.setChartRange({ min: event.min, max: event.max });
            }
            this.replaceRoute();
        },
        show: this.chartSeriesToggleHandler,
        hide: this.chartSeriesToggleHandler
    };

    /**
     * Takes an array of series indices to store and updates the route.
     *
     * @param visibleSeries An array of series indices that are visible
     */
    chartSeriesToggleHandler(visibleSeries: number[]): void {
        this.setChartSeries(visibleSeries);
        this.updateRoute();
    }

    changeViewToMap() {
        this.setCurrentView(ViewType.MapView);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
.cip-chart-view /deep/ {
    margin: 3rem 0;

    #dvChart1 [dv-chart-container] {
        margin: auto;
        height: 500px;
    }

    .highcharts-legend {
        left: 931px !important;
    }

    .highcharts-legend-item-hidden .fa-check {
        color: inherit !important;
    }

    #dvChart1 > details {
        margin-left: 61px;
        margin-right: 265px;
    }

    [dv-chart-slider-container] {
        margin-left: 61px;
        margin-right: 265px;

        margin-top: 0;
        margin-bottom: 20px;

        .noUi-target {
            background-image: linear-gradient(to right, #333 20%, rgba(255, 255, 255, 0) 0%);
            background-position-y: 7px;
            background-size: 10px 2px;
            background-repeat: repeat-x;
            border: none;
            box-shadow: none;
        }

        .noUi-connect {
            background-image: linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0) 20%,
                #003d79 20%,
                #003d79 80%,
                rgba(255, 255, 255, 0) 80%,
                rgba(255, 255, 255, 0) 100%
            ) !important;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-color: transparent;
            border: none;
            box-shadow: none;
        }

        .noUi-horizontal .noUi-handle {
            width: 22px;
            height: 22px;
            border-radius: 100%;
            top: -3px;
            left: -11px;
            cursor: pointer;

            &:after,
            &:before {
                display: none;
            }

            &:hover,
            &:focus {
                transform: scale(1.2, 1.2);
            }

            transition: transform 200ms ease-in;
        }

        .dv-slider-input {
            background-color: transparent;
            border: 1px solid transparent;
            border-bottom-color: #d9d9d9;
            width: 6rem;

            &:hover,
            &:focus {
                background-color: white;
                border-color: #d9d9d9;
            }
        }

        .dv-slider-input-label {
            // These are '.wb-inv' styles
            clip: rect(1px, 1px, 1px, 1px);
            height: 1px;
            margin: 0;
            overflow: hidden;
            position: absolute;
            width: 1px;
        }
    }
}
.cip-view-toggle {
    overflow: hidden;
    width: 250px;
    height: 130px;
    position: relative;
    right: 10px;
    top: -20px;
    float: right;
    margin: 0 0 0 2rem;
    cursor: pointer;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
        0px 3px 1px -2px rgba(0, 0, 0, 0.12);
    .cip-map-button {
        display: flex;
        flex-wrap: wrap;
        width: 256px * 2;
        height: 256px * 2;
        img {
            width: 256px;
            height: 256px;
        }
    }
    .cip-view-toggle-label {
        color: white;
        font-size: 2rem;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: darkblue;
        align-items: center;
        display: flex;
        justify-content: center;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.7);
        transition: opacity 200ms ease-in;
    }
    &:hover {
        .cip-view-toggle-label {
            opacity: 1;
        }
    }
}
</style>
