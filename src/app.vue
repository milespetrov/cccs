<template>
    <main role="main" property="mainContentOfPage" id="wb-cont" class="cip-scope" :class="viewName">

        <div class="cip-strip cip-backdrop-map">
            <map-instance :key="`instance-${reloadKey}`" v-if="reloadKey !== ''"></map-instance>
        </div>

        <div class="cip-strip cip-top-navigation">
            <!-- TODO: move top-navigatoin into a separate component -->
            <nav class="cip-navigation container">
                <geo-search></geo-search>

                <span class="separator"></span>
                <div>
                    <span class="menu-option">
                        <a href="./climate-basics.html">Climate Basics</a>
                        <i class="fas fa-chevron-down"></i>
                        <span class="menu-option-dropdown">
                            <a href="./climate-basics.html">Concepts</a>
                            <a href="./climate-basics.html">Impacts</a>
                            <a href="./climate-basics.html">Adaptations</a>
                            <a href="./climate-basics.html">Calendar</a>
                            <a href="./climate-basics.html">Notifications</a>
                            <a href="./climate-basics.html">Reports</a>
                            <a href="./climate-basics.html">Resources</a>
                        </span>
                    </span>

                    <span class="menu-option">
                        <a href="./data.html">Data</a>
                        <i class="fas fa-chevron-down"></i>
                        <span class="menu-option-dropdown">
                            <a href="./location-search.html">Location Search</a>
                            <a href="./climate-data.html">Climate Data</a>
                        </span>
                    </span>

                    <span class="menu-option">
                        <a href="#">Catalogue</a>
                        <i class="fas fa-chevron-down"></i>
                        <span class="menu-option-dropdown">
                            <a href=#>Catalogue section 1</a>
                            <a href=#>Catalogue section 2</a>
                            <a href=#>Catalogue section 3</a>
                            <a href=#>Catalogue section 4</a>
                        </span>
                    </span>
                </div>
            </nav>
        </div>

        <div class="cip-strip cip-page-header" @click="changeViewToMap">
            <!-- TODO: create two separate headers for map and chart views -->
            <!-- TODO: move header into a separate component -->
            <div class="cip-header container">
                <h1>Explore Climate Data</h1>

                <span class="cip-view-toggle-label">click to see the full map</span>
            </div>

        </div>

        <div class="cip-strip cip-view-controls">
            <keep-alive>
                <router-view class="container" name="view-controls"></router-view>
            </keep-alive>
        </div>

        <section class="container main">

            <p>A Climate Data Record (CDR) is a specific definition of a climate data series, developed by the Committee on Climate Data Records from NOAA Operational Satellites of the National Research Council at the request of NOAA in the context of satellite records.[1] It is defined as "a time series of measurements of sufficient length, consistency, and continuity to determine climate variability and change.".[2]</p>

            <keep-alive>
                <router-view class="visualization" name="visualization"></router-view>
            </keep-alive>

            <div class="pagedetails">
                <dl id="wb-dtmd">
                <dt>Date modified: </dt>
                <dd><time property="dateModified">2017-02-02</time></dd>

                </dl>
                <!-- <div class="row">
                    <div class="col-sm-6 col-md-5 col-lg-4">
                        <a href="https://www.canada.ca/en/report-problem.html" class="btn btn-default btn-block">Report a problem on this page</a>
                    </div>
                </div> -->
            </div>

        </section>
    </main>
</template>

<script lang="ts">
import { Vue, Watch, Component, Prop, Inject } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';
import { State } from 'vuex-class';

import Dropdown from 'bootstrap-vue/es/components/dropdown';
import FormSelect from 'bootstrap-vue/es/components/form-select';
Vue.use(Dropdown);
Vue.use(FormSelect);

import VariableSelector from './components/variable-selector.vue';
import MapInstance from './components/map-instance.vue';
import GeoSearch from './components/geo-search.vue';

@Component({
    components: {
        VariableSelector,
        MapInstance,
        GeoSearch
    }
})
export default class App extends Vue {
    @Action setTimePeriodId: (value: string) => void;
    @Action setVariableId: (value: string) => void;
    @Action setDatasetId: (value: string) => void;
    @Action setStationId: (value: string) => void;

    @Getter getQuery: Dictionary<string>;

    viewName: string = '';
    reloadKey: string = '';

    @State('variableId') currentVariable: string;

    @Watch('currentVariable')
    async onVariableChange() {
        this.reloadKey = this.currentVariable;
    }

    created(): void {
        this.$router.afterEach((to, from) => {
            if (this.$router.currentRoute.name == 'map-view') {
                this.updateStore('Annual_Annuel', to.query.v, to.query.d, to.query.s);
            }
            this.updateStore(to.query.t, to.query.v, to.query.d, to.query.s);
        });

        if (this.$router.currentRoute.name) {
            let defaultTime = null;

            // the route is set already
            if (this.$router.currentRoute.name == 'map-view') {
                defaultTime = "Annual_Annuel";
            }
            this.updateStore(
                defaultTime || this.$router.currentRoute.query.t || 'Jan_Janv',
                this.$router.currentRoute.query.v || 'tmax',
                this.$router.currentRoute.query.d || 'ahccd',
                this.$router.currentRoute.query.s || '1021830'
            );

            this.$router.push({
                name: this.$router.currentRoute.name,
                query: this.getQuery
            });
            return;
        }

        this.updateStore('Jan_Janv', 'tmax', 'ahccd', '1021830');

        // DEMO: push to the chart view on mount by default, so something will show up
        this.$router.push({
            name: 'chart-view',
            query: this.getQuery
        });
    }

    updateStore(
        timePeriodId: string,
        variableId: string,
        datasetId: string,
        stationId: string
    ): void {
        this.viewName = this.$router.currentRoute.name!;
        this.setTimePeriodId(timePeriodId);
        this.setVariableId(variableId);
        this.setDatasetId(datasetId);
        this.setStationId(stationId);
    }

    changeViewToMap() {
        if (this.viewName === 'map-view') {
            return;
        }

        this.setTimePeriodId('Annual_Annuel');
        this.$router.push({
            name: 'map-view',
            query: this.getQuery
        });
    }
}
</script>

<style lang="scss">
// global changes on top of bootstrap default stylings
@import './styles/vendor.scss';
</style>

<style lang="scss" scoped>
@import './styles/variables.scss';

// cip-strips go across the full width page
.cip-strip {
    position: relative;

    &.cip-backdrop-map {
        position: absolute;
        width: 100%;

        .chart-view & {
            height: $top-navigation-height + $page-header-height +
                $view-controls-height;
            overflow: hidden;
        }
    }

    &.cip-top-navigation {
        background-color: rgba(255, 255, 255, 0.95);
    }

    &.cip-page-header {
        .cip-view-toggle-label {
            display: none;
        }

        .map-view & {
            background-color: rgba(255, 255, 255, 0.7);

            @supports (backdrop-filter: blur(5px)) {
                background-color: rgba(255, 255, 255, 0.3);
                backdrop-filter: blur(5px);
            }
        }

        .chart-view & {
            &:hover {
                cursor: pointer;
                background-color: rgba(0, 0, 0, 0.5);

                @supports (backdrop-filter: blur(5px)) {
                    background-color: rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(5px);
                }

                .cip-header {
                    justify-content: center;
                    h1 {
                        display: none;
                    }

                    .cip-view-toggle-label {
                        color: white;
                        border: none;
                        background-color: rgba(0, 0, 0, 0.7);
                        padding: 11px;
                        display: inline-block;
                        font-size: 2.5rem;
                        margin: 0;
                    }
                }
            }
        }
    }

    &.cip-view-controls {
        background-color: #ecf0f1;
    }
}

.container.main {
    margin-top: 1rem;

    .map-view & {
        margin-top: calc(
            #{$backdrop-map-height} - #{$top-navigation-height} - #{$page-header-height} -
                #{$view-controls-height} + 1rem
        );
    }
}
.cip-header {
    height: $page-header-height;
    display: flex;
    align-items: center;
    h1 {
        color: white;
        border: none;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 11px;
        display: inline-block;
        font-size: 2.5rem;
        margin: 0;
    }
}
.main {
    position: relative; // background-color: white;
}
.cip-navigation {
    display: flex;
    align-items: center;
    height: $top-navigation-height; // padding: 1rem; // background-color: rgba(255, 255, 255, 0.7);
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
    > div {
        > .menu-option {
        margin: 0 2rem; // font-weight: bold;
        font-weight: bold;
        display: block;
        float: left;
        > svg {
            margin: auto;
        }
            }
            float: right;
        }
    .separator {
        flex: 1;
    }
    a {
        text-decoration: none;
        color: inherit;
    }
}
.menu-option:hover .menu-option-dropdown {
    display: block;
}
.menu-option-dropdown {
    display: none;
    position: absolute;
    background-color: rgba(255, 255, 255, 0.9);
    min-width: 185px;
    z-index: 1;
    a {
        float: none;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        text-align: left;
    }
}
.menu-option-dropdown > a:hover {
    background-color: #aaaaaa;
}
</style>
