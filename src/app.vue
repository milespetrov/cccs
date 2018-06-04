<template>
    <main role="main" property="mainContentOfPage" id="wb-cont" class="cip-scope container" :class="currentView">
        <div class="cip-header-container mrgn-bttm-lg">
            <h1>Explore climate data</h1>
        </div>

        <div class="cip-strip cip-view-controls">
            <keep-alive>
                <router-view class="container" name="view-controls"></router-view>
            </keep-alive>
        </div>
        

        <div class="cip-backdrop-map">
            <map-instance :key="`instance-${reloadKey}`" v-if="reloadKey !== ''"></map-instance>
        </div>

        <section class="main">

            <div class="cip-view-toggle" @click="changeViewToMap" v-if="tileCoordinates">
                <div class="cip-map-button"
                    :style="tileStyle">
                    <img :src="`${ tileUrl }/3/${ tileCoordinates.y }/${ tileCoordinates.x }`" alt="">
                    <img :src="`${ tileUrl }/3/${ tileCoordinates.y }/${ tileCoordinates.x + 1 }`" alt="">
                    <img :src="`${ tileUrl }/3/${ tileCoordinates.y + 1 }/${ tileCoordinates.x }`" alt="">
                    <img :src="`${ tileUrl }/3/${ tileCoordinates.y + 1 }/${ tileCoordinates.x + 1 }`" alt="">
                </div>

                <span class="cip-view-toggle-label">click to see the full map</span>
            </div>

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

import MapInstance from './components/map-instance.vue';
import GeoSearch from './components/geo-search.vue';
import { MapPoint, Range } from './store';
import api from './api/';
import { UpdateRouteMixin } from './globals/mixin';

import { ViewType } from '@/types';

@Component({
    components: {
        MapInstance,
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

    @State centerPoint: MapPoint;

    @Watch('centerPoint')
    onCenterPointChanged(): void {
        const mapInstance = api.RZ.mapInstances[api.RZ.mapInstances.length - 1];
        if (!mapInstance) {
            return;
        }
        const centerExtent = mapInstance._fgpMap.extent.getCenter();
        // let res = 529.1677250021168; // 8
        // let res = 926.0435187537042; // 7
        const res = 7937.5158750317505; // 3
        const xorigin = -34655800;
        const yorigin = 39310000;

        // TODO: clean up magic numbers

        let tx = (centerExtent.x - xorigin) / 256 / res;
        let ty = (-centerExtent.y + yorigin) / 256 / res;

        const dx = (tx % 1) * 256 + (tx % 1 > 0.5 ? 0 : 256) - 250 / 2;
        const dy = (ty % 1) * 256 + (ty % 1 > 0.5 ? 0 : 256) - 130 / 2;

        this.tileStyle = {
            transform: `translate(${-dx + 'px'}, ${-dy + 'px'})`
        };

        tx += tx % 1 > 0.5 ? 0 : -1;
        ty += ty % 1 > 0.5 ? 0 : -1;

        this.tileCoordinates = {
            x: Math.floor(tx),
            y: Math.floor(ty)
        };
    }

    tileUrl: string = 'http://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT3978/MapServer/tile';
    tileCoordinates: { x: number; y: number } | null = null;
    tileStyle: any = { transform: 'translate(0px, 0px)' };

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
            r: this.setRcpId
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

    changeViewToMap() {
        // TODO: is this check really necessary?
        if (this.currentView === ViewType.MapView) {
            return;
        }

        this.setCurrentView(ViewType.MapView);
        this.updateRoute();
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

.container.main {
    margin-top: 1rem;

    .chart-view & {
        .cip-view-toggle {
            display: block;
        }
    }
}
.main {
    position: relative; // background-color: white;
}
$rv-left-offset: calc((100vw - 1170px) / 2);
.cip-view-toggle {
    overflow: hidden;
    display: none;
    width: 250px;
    height: 130px;
    position: relative;
    right: -6px;
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
