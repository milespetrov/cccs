<template>
    <main role="main" property="mainContentOfPage" id="wb-cont" class="cip-scope container">
        <div class="cip-header-container mrgn-bttm-lg">
            <h1>{{ $t(`title`) }}</h1>
            <aside class="cip-map-view mrgn-bttm-lg" id="cip-map-description" aria-live="polite">
                <p>{{ $t(`description`) }}</p>
                <i18n :path="`description.help`" tag="p">
                    <a href role="button" @click.prevent="openRampHelp" @keyup.space="openRampHelp">{{ $t(`description.help.helpFile`) }}</a>
                    <a :href="`${aboutUrls['supportDesk']}`">{{$t('description.help.supportDesk')}}</a>
                </i18n>
            </aside>
        </div>

        <div class="cip-strip cip-view-controls">
            <map-view-controls></map-view-controls>
        </div>

        <section class="main">
            <map-view name="visualization" class="mrgn-bttm-lg" aria-describedby="cip-map-description cip-map-description-bottom"></map-view>

            <aside class="cip-map-view mrgn-bttm-lg" id="cip-map-description-bottom" aria-live="polite">
                <h2>{{$t('map.description.header')}}</h2>
                <div v-if="datasetId !== 'normal'">

                    <i18n :path="`map.${datasetId}_desc`" tag="p">
                        <p class="mrgn-tp-sm">{{$t(`map.${datasetId}_desc.extra`)}}</p>
                    </i18n>

                    <i18n :path="`map.description.technical`" tag="p">
                        <a :href="`${technicalDocsUrl}${technicalDocsRoute}`">{{ $t(`map.${datasetId}_desc.technicalLink`) }}</a>
                    </i18n>
                </div>

                <div v-else>
                    <div v-for="(item, index) in ['normal', 'monthly', 'daily']" :key="item">
                        <h3>{{$t(`map.${item}_desc.title`)}}</h3>
                        <p>{{$t(`map.${item}_desc`)}}</p>
                        <i18n :path="`map.description.technical.normal`" tag="p">
                            <a :href="`${technicalDocsUrl}${technicalDocsRoute[index]}`">{{ $t(`map.${item}_desc.technicalLink`) }}</a>
                        </i18n>
                    </div>
                </div>

                <i18n :path="`map.description.moreData`" tag="p">
                    <a :href="`${aboutUrls['supportDesk']}`">{{$t('description.help.supportDesk')}}</a>
                </i18n>
            </aside>

            

            <section class="panel panel-info">
                <header class="panel-heading">
                    <h2 class="panel-title">{{$t(`info.header`)}}</h2>
                </header>

                <div class="panel-body">
                    <div class="section">
                        <ul class="list-unstyled">
                            <li class="col-lg-12 col-md-12 col-sm-12 col-xs-12" v-for="item in infoItems" :key="`${item}`">
                                <a :href="`${aboutUrls[item]}`" class="btn-default well text-left" style="display: block; text-decoration: none;">
                                    <img :src="`assets/images/portal/${ $t(`info.${item}.icon`) }`" alt width="30" height="30" class="mrgn-rght-md">
                                    <strong>{{ $t(`info.${item}.title`) }}</strong>: {{ $t(`info.${item}.description`) }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <div class="pagedetails">
                <dl id="wb-dtmd">
                    <dt>{{ $t('page.dateModified') }}:</dt>
                    <dd>
                        <time property="dateModified">{{ timestamp }}</time>
                    </dd>
                </dl>
                <!-- <div class="row">
                    <div class="col-sm-6 col-md-5 col-lg-4">
                        <a href="https://www.canada.ca/en/report-problem.html" class="btn btn-default btn-block">Report a problem on this page</a>
                    </div>
                </div>-->
            </div>
        </section>
    </main>
</template>

<script lang="ts">
import { Vue, Watch, Component, Prop, Inject } from 'vue-property-decorator';
import { Getter, Action, State, namespace } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';
import { mixins } from 'vue-class-component';

import Dropdown from 'bootstrap-vue/es/components/dropdown';
import Collapse from 'bootstrap-vue/es/components/collapse';

Vue.use(Dropdown);
Vue.use(Collapse);

import { MapPoint } from './store/modules/app/app-state';
import api from './api/';
import { UpdateRouteMixin, StoreAppMixin, StoreDataMixin } from './globals/mixin';

import { ViewType, DatasetId, AppConfig, BreadCrumbEntity } from '@/types';
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
export default class App extends mixins(UpdateRouteMixin, StoreAppMixin, StoreDataMixin) {
    reloadKey: string = '';

    timestamp: string = (<any>window).PageTimestamp;

    @Watch('datasetId')
    async onDatasetChange(newValue: string, oldValue: string) {
        this.reloadKey = this.datasetId;

        if (oldValue === null) {
            return;
        }
        this.setFeatureId(null);
        this.updateRoute();
    }

    infoItems: string[] = ['library', 'basics', 'supportDesk', 'display'];
    aboutUrls: { [name: string]: string } = {};
    technicalDocsUrl: string = '';

    get queryToolRoute(): string {
        if (!this.urlSuffixes || !this.datasetId) {
            return '';
        }
        return this.urlSuffixes[this.datasetId].dataQuery[<'en' | 'fr'>i18n.locale];
    }

    get technicalDocsRoute(): string | string [] {
        if (!this.urlSuffixes || !this.datasetId) {
            return '';
        }
        if (this.datasetId === 'normal') {
            const suffixes = this.urlSuffixes[this.datasetId].technicalDocs[<'en' | 'fr'>i18n.locale];
            return [suffixes.normal || '', suffixes.monthly || '', suffixes.daily || ''];
        }
        return this.urlSuffixes[this.datasetId].technicalDocs[<'en' | 'fr'>i18n.locale];
    }

    async created(): Promise<void> {
        await $.getJSON('assets/configs/app-config.json', ({ climateviewerapp }: AppConfig) => {
            const currentLinks = climateviewerapp[<'en' | 'fr'>i18n.locale];

            this.setDataQueryUrl(currentLinks.queryToolUrl);
            this.setDataCatalogueUrl(currentLinks.dataCatalogueUrl);
            this.setLanguageToggleDomain(currentLinks.languageToggleDomain);
            this.setBreadCrumbUrls(currentLinks.breadcrumbs);

            this.aboutUrls = currentLinks.aboutUrls;
            this.technicalDocsUrl = currentLinks.technicalDocsUrl;
        });

        await $.getJSON('assets/configs/url-suffix-config.json', data => {
            this.setUrlSuffixes(data.urlSuffixes);
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
            r: this.setRcpId,
            ap: this.setAnalysisPeriod
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
        api.RAMP.mapInstances[api.RAMP.mapInstances.length - 1].mapI.help();
    }
}
</script>

<style lang="scss">
// global changes on top of bootstrap default stylings
@import "./styles/vendor.scss";
</style>

<style lang="scss" scoped>
@import "./styles/variables.scss";

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
