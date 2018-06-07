<template>
    <main role="main" property="mainContentOfPage" id="wb-cont" class="cip-scope container" :class="currentView">
        <div class="cip-header-container mrgn-bttm-lg">
            <h1>Explore climate data</h1>
        </div>

        <div class="cip-strip cip-view-controls">
            <keep-alive>
                <router-view name="view-controls"></router-view>
            </keep-alive>
        </div>

        <section class="main">

            

            <keep-alive>
                <router-view class="visualization" name="visualization"></router-view>
            </keep-alive>

            <section class="alert alert-info">
                <h4 class="text-info mrgn-tp-sm"> Need help? </h4>
                <p> Look through the CCDS <a class="underline" href="http://climate-scenarios.canada.ca/index.php?page=scen-intromenu">resources overview</a> and <a class="underline" href="http://climate-scenarios.canada.ca/index.php?page=data-categories">data categories</a>. Contact CCDS <a class="underline" href="http://climate-scenarios.canada.ca/index.php?page=contact">here</a>.
                </p>
            </section>

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
import { Getter, Action, State } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';
import { mixins } from 'vue-class-component';

import Dropdown from 'bootstrap-vue/es/components/dropdown';
import FormSelect from 'bootstrap-vue/es/components/form-select';
Vue.use(Dropdown);
Vue.use(FormSelect);

import GeoSearch from './components/geo-search.vue';
import { MapPoint, Range } from './store';
import api from './api/';
import { UpdateRouteMixin } from './globals/mixin';

import { ViewType } from '@/types';

@Component({
    components: {
        GeoSearch
    }
})
export default class App extends mixins(UpdateRouteMixin) {
    @Action setCurrentView: (value: ViewType) => void;
    @Action setTimePeriodId: (value: string | null) => void;
    @Action setVariableId: (value: string | null) => void;
    @Action setDatasetId: (value: string | null) => void;
    @Action setFeatureId: (value: string | null) => void;
    @Action setCenterPoint: (value: string | null) => void;
    @Action setZoomLevel: (value: string | null) => void;
    @Action setChartSeries: (value: number[] | null) => void;
    @Action setTimeSlice: (value: number | null) => void;
    @Action setFeaturePoint: (value: { x: number; y: number } | string | null) => void;
    @Action setRcpId: (value: string | null) => void;
    @Action clearChart: () => void;
    @Action setChartRange: (value: Range | string | null) => void;
    @Action setTileInfo: (value: number[] | string | null) => void;

    @State currentView: string;

    @State internalRouteUpdate: boolean;
    @Action setInternalRouteUpdate: (value: boolean) => void;

    reloadKey: string = '';

    @State('datasetId') currentDataset: string;

    @Watch('currentDataset')
    async onDatasetChange(newValue: string, oldValue: string) {
        this.reloadKey = this.currentDataset;

        if (oldValue === null) {
            return;
        }
        this.setFeatureId(null);
        this.clearChart();
        this.updateRoute();
    }

    created(): void {
        // This is to allow the back/forward browser functions to update the store
        // We flag internal updates with `internalRouteUpdate` in the store so that
        // we don't double up on internal state commits
        this.$router.afterEach((to, from) => {
            if (this.internalRouteUpdate) {
                this.setInternalRouteUpdate(false);
                return;
            }
            this.routeHandler();
        });

        this.routeHandler();
    }

    routeHandler(): void {
        if (!this.$router.currentRoute.name) {
            return;
        }

        interface FunctionArray {
            [key: string]: any;
        }

        // map from query param to store function
        const storeFns: FunctionArray = {
            t: this.setTimePeriodId,
            v: this.setVariableId,
            d: this.setDatasetId,
            f: this.setFeatureId,
            cp: this.setCenterPoint,
            cs: this.setChartSeries,
            cr: this.setChartRange,
            z: this.setZoomLevel,
            ts: this.setTimeSlice,
            fp: this.setFeaturePoint,
            r: this.setRcpId,
            ti: this.setTileInfo
        };

        // update the store
        this.setCurrentView(this.$router.currentRoute.name as ViewType);
        Object.keys(storeFns).forEach(parameter => {
            const value: string = this.$router.currentRoute.query[parameter];
            if (!value) {
                return;
            }

            storeFns[parameter](value);
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

.cip-backdrop-map {
    position: relative;
    width: 100%;
    top: 0;
}

.cip-strip {
    position: relative;

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
            }
        }
    }

    &.cip-view-controls {
        background-color: #ecf0f1;
    }
}
.cip-header-container {
    z-index: 1;
    position: relative;
}

.main {
    position: relative; // background-color: white;

    .chart-view & {
        .cip-view-toggle {
            display: block;
        }
    }
}
</style>
