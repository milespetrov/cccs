<template>
    <div class="cip-view-controls container">
        
        <div class="menu-option" v-for="controlRef in getControls" :key="`${controlRef}`">
            <component :is="controlRef"></component>
        </div>

        <span class="separator"></span>

        <div class="menu-option">
            <b-dropdown text="Download" variant="light" right>
                <div role="group" aria-lableledby="chart-download-data">
                    
                    <div class="cip-dropdown-info">
                        <h6 class="dropdown-header">Download</h6>
                        <div class="cip-dropdown-description">Dictumst curae nibh lectus massa torquent nisl ac tempus, risus gravida tortor primis sodales ullamcorper vestibulum, phasellus posuere purus metus cubilia vulputate ut.</div>
                    </div>

                    <b-dropdown-divider></b-dropdown-divider>
                    
                    <b-dropdown-header id="chart-download-data">Data</b-dropdown-header>
                    <div class="cip-dropdown-multi-item">
                        <span>Full Time Range</span>

                        <div class="cip-dropdown-multi-item-options">
                            <b-dropdown-item-button @click="downloadData('csv', true)">.csv</b-dropdown-item-button>
                            <b-dropdown-item-button @click="downloadData('xls', true)">.xls</b-dropdown-item-button>
                        </div>
                    </div>
                    <div class="cip-dropdown-multi-item">
                        <span>Visible Time Range Only</span>

                        <div class="cip-dropdown-multi-item-options">
                            <b-dropdown-item-button @click="downloadData('csv')">.csv</b-dropdown-item-button>
                            <b-dropdown-item-button @click="downloadData('xls')">.xls</b-dropdown-item-button>
                        </div>
                    </div>
                </div>
                
                <b-dropdown-divider></b-dropdown-divider>

                <div role="group" aria-lableledby="chart-download-image">
                    <b-dropdown-header id="chart-download-image">Image</b-dropdown-header>
                    <div class="cip-dropdown-multi-item">
                        <span>Chart</span>

                        <div class="cip-dropdown-multi-item-options">
                            <b-dropdown-item-button @click="downloadImage('png')">.png</b-dropdown-item-button>
                            <b-dropdown-item-button @click="downloadImage('jpeg')">.jpeg</b-dropdown-item-button>
                            <b-dropdown-item-button @click="downloadImage('pdf')">.pdf</b-dropdown-item-button>
                            <b-dropdown-item-button @click="downloadImage('svg')">.svg</b-dropdown-item-button>
                        </div>
                    </div>
                </div>
                <b-dropdown-divider></b-dropdown-divider>

                <b-dropdown-item-button>Access full dataset in Catalogue</b-dropdown-item-button>
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

import api from './../api/main';

@Component({
    components: selectors
})
export default class ChartViewControls extends Vue {
    @Getter getControls: string[];
    @Getter getQuery: Dictionary<string>;

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
