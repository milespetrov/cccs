<template>
    <div class="visualization-menu container">

        <div class="menu-option">
            <b-form-select v-model="selectedTimePeriod" :options="timePeriods"></b-form-select>
        </div>

        <span class="separator"></span>

        <div class="menu-option">
            <button @click="changeView('map-view')">map</button>
        </div>

        <div class="menu-option">
            <b-dropdown text="Download" variant="light" class="m-md-2" right>
                <div role="group" aria-lableledby="chart-download-data">
                    <b-dropdown-header id="chart-download-data">Data</b-dropdown-header>
                    <div class="dropdown-item-mutli">
                        <span>Full Time Range</span>

                        <div class="dropdown-item-mutli-options">
                            <b-dropdown-item-button @click="downloadData('csv', true)">.csv</b-dropdown-item-button>
                            <b-dropdown-item-button @click="downloadData('xls', true)">.xls</b-dropdown-item-button>
                        </div>
                    </div>
                    <div class="dropdown-item-mutli">
                        <span>Visible Time Range Only</span>

                        <div class="dropdown-item-mutli-options">
                            <b-dropdown-item-button @click="downloadData('csv')">.csv</b-dropdown-item-button>
                            <b-dropdown-item-button @click="downloadData('xls')">.xls</b-dropdown-item-button>
                        </div>
                    </div>
                </div>
                <b-dropdown-divider></b-dropdown-divider>

                <div role="group" aria-lableledby="chart-download-image">
                    <b-dropdown-header id="chart-download-image">Image</b-dropdown-header>
                    <div class="dropdown-item-mutli">
                        <span>Chart</span>

                        <div class="dropdown-item-mutli-options">
                            <b-dropdown-item-button @click="downloadImage('png')">.png</b-dropdown-item-button>
                            <b-dropdown-item-button @click="downloadImage('jpeg')">.jpeg</b-dropdown-item-button>
                            <b-dropdown-item-button @click="downloadImage('pdf')">.pdf</b-dropdown-item-button>
                            <b-dropdown-item-button @click="downloadImage('svg')">.svg</b-dropdown-item-button>
                        </div>
                    </div>
                </div>
                <b-dropdown-divider></b-dropdown-divider>

                <b-dropdown-item-button>Print Chart</b-dropdown-item-button>
                <b-dropdown-divider></b-dropdown-divider>

                <b-dropdown-item>Access full dataset in Catalogue</b-dropdown-item>
            </b-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { sprintf } from 'sprintf-js';

import api from './../api/main';

@Component
export default class ChartViewControls extends Vue {
    timePeriods: string[] = [
        'Jan_Janv',
        'Feb_Fev',
        'Mar_March',
        'Apr_Avr',
        'May_Mai',
        'June_Juin',
        'July_Juil',
        'Aug_Aout',
        'Sept_Sept',
        'Oct_Oct',
        'Nov_Nov',
        'Dec_Dec',
        'Annual_Annuel',
        'Winter_Hiver',
        'Spring_Printemp',
        'Summer_Ete',
        'Autumn_Autome'
    ];
    selectedTimePeriod: string = this.timePeriods[0];

    mounted(): void {
        this.changeTimePeriod();
    }

    @Watch('selectedTimePeriod')
    changeTimePeriod(): void {
        this.$router.push({
            name: 'chart-view',
            query: { t: this.selectedTimePeriod, v: 'temperature' }
        });
    }

    changeView(viewName: string): void {
        this.$router.push({
            name: viewName,
            query: { t: this.selectedTimePeriod, v: 'temperature' }
        });
    }

    downloadImage(type: string): void {
        (<any>window).DQV.charts.dvChart1.highchart.exportChart({
            type
        });
    }

    downloadData(type: 'csv' | 'xls', fullRange: boolean = false): void {
        // get highchart instance
        const chart = (<any>window).DQV.charts.dvChart1.highchart;

        // cache current extremes
        let extremes = chart.xAxis[0].getExtremes();

        // if need full range, adjust quickly reset chart to the full range
        if (fullRange) {
            chart.xAxis[0].setExtremes(
                extremes.dataMin,
                extremes.dataMax,
                true,
                false
            );
        }

        const downloadMap: { [name: string]: () => void } = {
            csv: chart.downloadCSV,
            xls: chart.downloadXLS
        };

        downloadMap[type].call(chart);

        // reset chart to the previously selected range if a full-range download was requested
        if (fullRange) {
            chart.xAxis[0].setExtremes(extremes.min, extremes.max, true, false);
        }
    }
}
</script>

<style lang="scss" scoped>
.visualization-menu {
    height: 3rem * 1.6;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 1rem;
    padding-left: 0;
    background-color: lightgray;

    .separator {
        flex: 1;
    }

    .menu-option {
        margin: 0 2rem;
        // font-weight: bold;

        > svg {
            margin: auto;
        }
    }
}

.b-dropdown {
    .dropdown-item-mutli {
        display: flex;
        align-items: center;
        padding: 0.25rem 1.5rem;

        span {
            flex: 1 0 auto;
            white-space: nowrap;
            margin-right: 4rem;
        }

        &-options {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            width: 14rem;

            .dropdown-item {
                // flex-basis: 50%;
                width: 50%;
                text-align: center;
            }
        }
    }
}
</style>
