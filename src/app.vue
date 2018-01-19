<template>
    <main role="main" property="mainContentOfPage" id="wb-cont" class="cip-scope">

        <span class="fake-location-search-map" v-if="currentView === 'chart-view'"></span>

        <nav class="top-level-menu container">
            <h2 class="title">
                <i class="fas fa-globe fa-lg"></i>
                <span>Canadian Climate Portal Services</span>
            </h2>

            <span class="separator"></span>

            <span class="menu-option">
                <span>Climate Basics</span>
                <i class="fas fa-chevron-down"></i>
            </span>

            <span class="menu-option">
                <span>Data</span>
                <i class="fas fa-chevron-down"></i>
            </span>

            <span class="menu-option">
                <span>Catalogue</span>
                <i class="fas fa-chevron-down"></i>
            </span>

        </nav>

        <nav class="location-search container">

            <div class="search-box">
                <i class="fas fa-map-marker-alt fa-lg"></i>
                <input type="text" class="form-control" placeholder="enter location" />
                <i class="fas fa-search"></i>
            </div>
        </nav>

        <section class="container main">

            <variable-selector class="variable-selector"></variable-selector>

            <section class="content">
                <div class="visualization-menu container">

                    <div class="menu-option">
                        <select v-model="selectedTimePeriod">
                            <option v-for="timePeriod in timePeriods" :key="timePeriod">{{ timePeriod }}</option>
                        </select>
                    </div>

                    <button @click="currentView = 'map-view'">map</button>
                    <button @click="currentView = 'chart-view'">chart</button>

                    <span class="separator"></span>

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


                <keep-alive>
                    <component :is="currentView" :selectedTimePeriod="selectedTimePeriod" class="visualization"></component>
                </keep-alive>

            </section>

        </section>
    </main>
</template>


<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';

import ChartView from './components/chart-view.vue';
import MapView from './components/map-view.vue';
import VariableSelector from './components/variable-selector.vue';

import store from './store';

import Dropdown from 'bootstrap-vue/es/components/dropdown';
Vue.use(Dropdown);

@Component({
    components: {
        'chart-view': ChartView,
        'map-view': MapView,
        'variable-selector': VariableSelector
    }
})
export default class App extends Vue {
    currentView: string = 'chart-view';

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

<style lang="scss">
.cip-scope {
    // import the bootstrap .scss files to be scoped under `.cip-scope`
    // if not scoped, bootstrap rules interfere with WET's modified bootstrap version
    // importing everything from the bootstrap is wasteful and propbaly not needed
    // especially the grid system which will still interfere with WET version of bootstrap on elements inside the scope

    // this import is left her for reference (if bootstrap styles are broken, try importing evething to check if something is missing from the list below)
    // @import './../node_modules/bootstrap/scss/bootstrap.scss';

    // the following is the full list of bootstrap modules with a minimum set of required elements imported
    @import './../node_modules/bootstrap/scss/functions';
    @import './../node_modules/bootstrap/scss/variables';
    @import './../node_modules/bootstrap/scss/mixins';
    // @import './../node_modules/bootstrap/scss/root';
    // @import './../node_modules/bootstrap/scss/print';
    // @import './../node_modules/bootstrap/scss/reboot';
    // @import './../node_modules/bootstrap/scss/type';
    // @import './../node_modules/bootstrap/scss/images';
    // @import './../node_modules/bootstrap/scss/code';
    // @import './../node_modules/bootstrap/scss/grid';
    // @import './../node_modules/bootstrap/scss/tables';
    // @import './../node_modules/bootstrap/scss/forms';
    @import './../node_modules/bootstrap/scss/buttons';
    // @import './../node_modules/bootstrap/scss/transitions';
    @import './../node_modules/bootstrap/scss/dropdown';
    // @import './../node_modules/bootstrap/scss/button-group';
    // @import './../node_modules/bootstrap/scss/input-group';
    // @import './../node_modules/bootstrap/scss/custom-forms';
    // @import './../node_modules/bootstrap/scss/nav';
    // @import './../node_modules/bootstrap/scss/navbar';
    // @import './../node_modules/bootstrap/scss/card';
    // @import './../node_modules/bootstrap/scss/breadcrumb';
    // @import './../node_modules/bootstrap/scss/pagination';
    // @import './../node_modules/bootstrap/scss/badge';
    // @import './../node_modules/bootstrap/scss/jumbotron';
    // @import './../node_modules/bootstrap/scss/alert';
    // @import './../node_modules/bootstrap/scss/progress';
    // @import './../node_modules/bootstrap/scss/media';
    // @import './../node_modules/bootstrap/scss/list-group';
    // @import './../node_modules/bootstrap/scss/close';
    // @import './../node_modules/bootstrap/scss/modal';
    // @import './../node_modules/bootstrap/scss/tooltip';
    // @import './../node_modules/bootstrap/scss/popover';
    // @import './../node_modules/bootstrap/scss/carousel';
    @import './../node_modules/bootstrap/scss/utilities';

    // import vue-bootstrap under the scope as well just in case; it doesn't seem to be interfering with WET styles though
    @import './../node_modules/bootstrap-vue/dist/bootstrap-vue.css';

    // global changes on top of bootstrap default stylings
    @import './styles/vendor.scss';
}
</style>

<style lang="scss" scoped>
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

// TODO: remove demo hack
.fake-location-search-map {
    position: absolute;
    background-image: url(https://i.imgur.com/BdnP4yF.png);
    top: 0;
    left: 0;
    right: 0;
    height: 175px;
}

.top-level-menu {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.7);
    position: relative;

    .title {
        margin: 0 0 0 1rem;
        padding: 0;
        display: flex;
        align-items: center;

        > svg {
            margin-right: 1rem;
        }

        > span {
            font-size: 2rem;
        }
    }

    .menu-option {
        margin: 0 2rem;
        font-weight: bold;

        > svg {
            margin: auto;
        }
    }

    .separator {
        flex: 1;
    }
}

.visualization-menu {
    height: 3rem * 1.6;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 1rem;
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

    .variable-selector {
    }
}

.location-search {
    display: flex;
    align-items: center;
    height: 120px;

    .search-box {
        width: 30%;
        margin-left: 1rem;
        position: relative;
        display: flex;
        align-items: center;

        input {
            padding: 0 3rem 0 3.5rem;
            width: 100%;
        }

        > .fa-map-marker-alt {
            color: grey;
            position: absolute;
            left: 1rem;
            height: 37px;
            top: 0;
        }

        > .fa-search {
            position: absolute;
            right: 1rem;
            height: 37px;
            top: 0;
        }
    }
}

.container.main {
    display: flex;
}

.content {
    flex: 1;
}

.variable-selector {
    // border: 1px solid red;
    width: 20%;
}
</style>
