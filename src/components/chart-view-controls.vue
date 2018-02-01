<template>
    <div class="cip-view-controls container">

        <div class="menu-option">
            <b-form-select v-model="timePeriod" :options="timePeriods"></b-form-select>
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

                <b-dropdown-item>Access full dataset in Catalogue</b-dropdown-item>
            </b-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import { sprintf } from 'sprintf-js';

import api from './../api/main';
import { Dictionary } from 'vue-router/types/router';

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

    @State timePeriodId: string;
    @Getter getQuery: Dictionary<string>;
    @Action setTimePeriodId: (id: string) => void;

    get timePeriod(): string {
        return this.timePeriodId;
    }

    set timePeriod(value: string) {
        this.setTimePeriodId(value);

        this.$router.push({
            name: 'chart-view',
            query: this.getQuery
        });
    }

    changeView(viewName: string): void {
        this.$router.push({
            name: viewName,
            query: this.getQuery
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
@import './../styles/variables.scss';
@import './../styles/view-controls.scss';
</style>
