<template>
    <main role="main" property="mainContentOfPage" id="wb-cont" class="cip-scope container">
        <div class="cip-header-container mrgn-bttm-lg">
            <h1>{{ $t(`title`) }}</h1>
            <aside class="cip-map-view mrgn-bttm-lg" id="cip-map-description" aria-live="polite">
                <i18n :path="`description`" tag="p">
                    <a href="" role="button" @click.prevent="openRampHelp" @keyup.space="openRampHelp">{{ $t(`helpFile`) }}</a>
                </i18n>
            </aside>
        </div>

        <div class="cip-strip cip-view-controls">
            <map-view-controls></map-view-controls>
        </div>

        <section class="main">

            <map-view name="visualization" class="mrgn-bttm-lg" aria-describedby="cip-map-description"></map-view>

            <aside class="cip-map-view mrgn-bttm-lg" id="cip-map-description" aria-live="polite">
                <i18n :path="`map.${datasetId}_desc`" tag="p">
                    <a :href="`${queryToolBaseUrl}${queryToolRoute}`" target="_blank">{{ $t(`map.extractTool`) }}</a>
                </i18n>
            </aside>

            <div class="pagedetails">
                <dl id="wb-dtmd">
                <dt>{{ $t('page.dateModified') }}: </dt>
                <dd><time property="dateModified">{{ timestamp }}</time></dd>

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
import Collapse from 'bootstrap-vue/es/components/collapse';

Vue.use(Dropdown);
Vue.use(Collapse);

import { MapPoint } from './store';
import api from './api/';
import { UpdateRouteMixin } from './globals/mixin';

import { ViewType, DatasetId } from '@/types';
import MapView from './components/map-view.vue';
import MapViewControls from './components/map-view-controls.vue';
import { datasets } from '@/configs/datasets';
import { i18n } from './lang';

@Component({
    components: {
        MapView,
        MapViewControls
    }
})
export default class App extends mixins(UpdateRouteMixin) {
    @Action setTimePeriodId: (value: string | null) => void;
    @Action setVariableId: (value: string | null) => void;
    @Action setDatasetId: (value: string | null) => void;
    @Action setFeatureId: (value: string | null) => void;
    @Action setCenterPoint: (value: string | null) => void;
    @Action setZoomLevel: (value: string | null) => void;
    @Action setTimeSlice: (value: number | null) => void;
    @Action setFeaturePoint: (value: { x: number; y: number } | string | null) => void;
    @Action setRcpId: (value: string | null) => void;

    @State internalRouteUpdate: boolean;
    @Action setInternalRouteUpdate: (value: boolean) => void;

    reloadKey: string = '';

    timestamp: string = (<any>window).PageTimestamp;

    @State datasetId: DatasetId;

    @Watch('datasetId')
    async onDatasetChange(newValue: string, oldValue: string) {
        this.reloadKey = this.datasetId;

        if (oldValue === null) {
            return;
        }
        this.setFeatureId(null);
        this.updateRoute();
    }

    queryToolBaseUrl: string = '';
    serviceDeskUrl: string = '';

    get queryToolRoute(): string {
        return datasets[this.datasetId].queryToolRoute[<'en' | 'fr'>i18n.locale];
    }

    async created(): Promise<void> {
        await $.getJSON('assets/configs/app-config.json', data => {
            this.queryToolBaseUrl = data.queryToolUrl;
            this.serviceDeskUrl = data.serviceDeskUrl;
        });
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
            z: this.setZoomLevel,
            ts: this.setTimeSlice,
            fp: this.setFeaturePoint,
            r: this.setRcpId
        };

        const defaultSettings: FunctionArray = {
            d: 'dcs'
        };

        // update the store
        Object.keys(storeFns).forEach(parameter => {
            const value: string = this.$router.currentRoute.query[parameter] || defaultSettings[parameter];
            if (!value) {
                return;
            }

            storeFns[parameter](value);
        });
    }

    openRampHelp(): void {
        api.RZ.mapInstances[api.RZ.mapInstances.length - 1].mapI.help();
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

        background-color: rgba(255, 255, 255, 0.7);

        @supports (backdrop-filter: blur(5px)) {
            background-color: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(5px);
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
}
</style>
