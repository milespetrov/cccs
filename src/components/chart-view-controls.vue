<template>
    <div class="cip-view-controls">
        
        <div class="menu-option" v-for="controlRef in getControls" :key="`${controlRef}`">
            <component :is="controlRef"></component>
        </div>

        <span class="separator"></span>

        <div class="menu-option">
            <b-dropdown variant="light" right class="cip-dropdown-right cip-selector">
                
                <template slot="button-content">
                    <div class="cip-content-wrap">
                        <span class="cip-selected-value">Download</span>
                    </div>
                </template>
                
                <div class="cip-dropdown-info">
                    <span class="dropdown-header">Download</span>
                    <div class="cip-dropdown-description">Dictumst curae nibh lectus massa torquent nisl ac tempus, risus gravida tortor primis sodales ullamcorper vestibulum, phasellus posuere purus metus cubilia vulputate ut.</div>
                </div>

                <b-dropdown-divider></b-dropdown-divider>

                <div role="group" aria-lableledby="chart-download-data">

                    <b-dropdown-header id="chart-download-data">Chart data</b-dropdown-header>

                    <b-dropdown-item-button @click="downloadData('xls', true)">XLS file</b-dropdown-item-button>
                    <b-dropdown-item-button @click="downloadData('csv', true)">CSV file</b-dropdown-item-button>

                </div>
                
                <b-dropdown-divider></b-dropdown-divider>

                <div role="group" aria-lableledby="chart-download-image">
                    <b-dropdown-header id="chart-download-image">Chart image</b-dropdown-header>

                    <b-dropdown-item-button @click="downloadImage('png')">PNG image</b-dropdown-item-button>
                    <b-dropdown-item-button @click="downloadImage('jpeg')">JPEG image</b-dropdown-item-button>
                    <b-dropdown-item-button @click="downloadImage('pdf')">PDF file</b-dropdown-item-button>
                    <b-dropdown-item-button @click="downloadImage('svg')">SVG image</b-dropdown-item-button>

                </div>

                <b-dropdown-divider></b-dropdown-divider>

                <div role="group" aria-lableledby="chart-download-dataset">
                    <b-dropdown-header id="chart-download-dataset">Dataset</b-dropdown-header>

                    <b-dropdown-item target="_blank" href="https://open.canada.ca/en/open-data">
                        <span class="cip-name"><span class="wb-inv">Access full dataset in</span> Data Catalogue</span>
                        <i class="fas fa-external-link-alt"></i>
                    </b-dropdown-item>

                </div>
                
            </b-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { Dictionary } from 'vue-router/types/router';
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import selectors from './vis-controls/selectors';

import { sprintf } from 'sprintf-js';

import api from './../api/';

@Component({
    components: selectors
})
export default class ChartViewControls extends Vue {
    @Getter getControls: string[];

    downloadImage(type: string): void {
        (<any>window).DQV.charts.dvChart1.highchart.exportChart({
            type
        });
    }

    downloadData(type: 'csv' | 'xls', fullRange: boolean = false): void {
        // get highchart instance
        const chart = (<any>window).DQV.charts.dvChart1.highchart;

        // cache current extremes
        const extremes = chart.xAxis[0].getExtremes();

        // if need full range, adjust quickly reset chart to the full range
        if (fullRange) {
            chart.xAxis[0].setExtremes(extremes.dataMin, extremes.dataMax, true, false);
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
