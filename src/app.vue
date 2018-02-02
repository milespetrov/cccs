<template>
    <main role="main" property="mainContentOfPage" id="wb-cont" class="cip-scope" :class="viewName">
        
        <div class="cip-strip cip-backdrop-map">
            <map-instance></map-instance>
        </div>

        <div class="cip-strip cip-top-navigation">
            <!-- TODO: move top-navigatoin into a separate component -->
            <nav class="cip-navigation container">
                <div class="search-box">
                    <i class="fas fa-map-marker-alt fa-lg"></i>
                    <input type="text" class="form-control" placeholder="enter location" />
                    <i class="fas fa-search"></i>
                </div>
                

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
        </div> 

        <div class="cip-strip cip-page-header">
            <!-- TODO: move header into a separate component -->
            <div class="cip-header container">
                <h1>Explore Climate Data</h1>
            </div>

        </div>

        <div class="cip-strip cip-view-controls">
            <keep-alive>
                <router-view class="container" name="view-controls"></router-view>
            </keep-alive>            
        </div>

        <section class="container main">
                                
            <!-- <h2>Mean Temperature</h2>
            <h3>Adjusted and homogenized Canadian climate data</h3> -->

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
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';

import Dropdown from 'bootstrap-vue/es/components/dropdown';
import FormSelect from 'bootstrap-vue/es/components/form-select';
Vue.use(Dropdown);
Vue.use(FormSelect);

import VariableSelector from './components/variable-selector.vue';
import MapInstance from './components/map-instance.vue';

@Component({
    components: {
        'variable-selector': VariableSelector,
        'map-instance': MapInstance
    }
})
export default class App extends Vue {
    @Action setTimePeriodId: (value: string) => void;
    @Action setVariableId: (value: string) => void;
    @Action setDatasetId: (value: string) => void;

    @Getter getQuery: Dictionary<string>;

    viewName: string = '';

    created(): void {
        this.$router.afterEach((to, from) => {
            this.updateStore(to.query.t, to.query.v, to.query.d);
        });

        if (this.$router.currentRoute.name) {
            // the route is set already

            this.updateStore(
                this.$router.currentRoute.query.t,
                this.$router.currentRoute.query.v,
                this.$router.currentRoute.query.d
            );
            return;
        }

        this.updateStore('Jan_Janv', 'max-temp', 'ahccd');

        // DEMO: push to the chart view on mount by default, so something will show up
        this.$router.push({
            name: 'chart-view',
            query: this.getQuery
        });
    }

    updateStore(
        timePeriodId: string,
        variableId: string,
        datasetId: string
    ): void {
        this.viewName = this.$router.currentRoute.name!;
        this.setTimePeriodId(timePeriodId);
        this.setVariableId(variableId);
        this.setDatasetId(datasetId);
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
        background-color: rgba(255, 255, 255, 1);
    }

    &.cip-page-header {
        // TODO: backdrop-blur?
        .map-view & {
            background-color: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(5px);
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
    .menu-option {
        margin: 0 2rem;
        // font-weight: bold;
        > svg {
            margin: auto;
        }
    }
    .separator {
        flex: 1;
    }
}
.search-box {
    width: 25%; // margin-left: 1rem;
    position: relative;
    display: flex;
    align-items: center;
    input {
        // hide the default styles
        border: none;
        box-shadow: none;
        border-bottom: 1px solid grey;
        border-radius: 0;
        margin-right: 3rem;
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
    /* > .fa-search {
        position: absolute;
        right: 1rem;
        height: 37px;
        top: 0;
    } */
}
.location-search {
    display: flex;
    align-items: center;
    height: 120px;
}
</style>
