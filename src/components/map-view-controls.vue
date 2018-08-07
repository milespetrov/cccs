<template>
    <div class="cip-view-controls">

        <button
            @click="showCollapse = !showCollapse"
            class="cip-controls-toggle btn btn-primary hidden-md hidden-lg">

            <span v-show="showCollapse"><font-awesome-icon icon="times" fixed-width /></span>
            <span v-show="!showCollapse"><font-awesome-icon icon="sliders-h" fixed-width /></span>
            <span class="cip-label">{{ $t('settings.title') }}</span>

        </button>

        <b-collapse class="cip-controls-wrapper" v-model="showCollapse" id="cip-view-controls-collapse">

            <div class="cip-controls">
                <div class="menu-option" v-for="controlRef in getControls" :key="`${controlRef}`">
                    <component :is="controlRef"></component>
                </div>

                <span class="separator hidden-sm hidden-xs"></span>

                <div class="menu-option">

                    <b-dropdown variant="light" right class="cip-dropdown-right cip-selector">
                        <template slot="button-content">
                            <div class="cip-content-wrap">
                                <span class="cip-selected-value">{{ $t(`${tDSPath}.title`) }}</span>
                            </div>
                        </template>

                        <div class="cip-dropdown-info">
                            <span class="dropdown-header">{{ $t(`${tDSPath}.header`) }}</span>
                            <div class="cip-dropdown-description">{{ $t(`${tDSPath}.description`) }}</div>
                        </div>

                        <b-dropdown-divider></b-dropdown-divider>

                        <div role="group" aria-lableledby="map-image-export" :key="`group-a`">
                            <b-dropdown-header id="map-image-export">{{ $t(`${tDSPath}.mapImage_group`) }}</b-dropdown-header>

                            <b-dropdown-item-button @click="downloadImage('png', true)">{{ $t(`${tDSPath}.png.fullName`) }}</b-dropdown-item-button>
                            <b-dropdown-item-button @click="downloadImage('jpg', true)">{{ $t(`${tDSPath}.jpeg.fullName`) }}</b-dropdown-item-button>
                        </div>

                        <b-dropdown-divider></b-dropdown-divider>

                        <div role="group" aria-lableledby="map-data-export" :key="`group-b`">
                            <b-dropdown-header id="map-data-export">{{ $t(`${tDSPath}.dataset_group`) }}</b-dropdown-header>

                            <b-dropdown-item target="_blank" href="https://open.canada.ca/en/open-data">

                                <i18n :path="`${tDSPath}.dataCatalogue.fullName`" tag="span" class="cip-name">
                                    <span class="wb-inv">{{ $t(`${tDSPath}.dataCatalogue.access`) }}</span>
                                </i18n>

                                <font-awesome-icon icon="external-link-alt" />
                            </b-dropdown-item>

                            <b-dropdown-item target="_blank" :href="`${queryToolBaseUrl}${queryToolRoute}`">

                                <i18n :path="`${tDSPath}.queryTool.fullName`" tag="span" class="cip-name">
                                    <span class="wb-inv">{{ $t(`${tDSPath}.queryTool.access`) }}</span>
                                </i18n>

                                <font-awesome-icon icon="external-link-alt" />
                            </b-dropdown-item>
                        </div>

                    </b-dropdown>
                </div>
            </div>

        </b-collapse>
    </div>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import BaseSelectorV from 'src/components/vis-controls/base-selector.vue';
import selectors from './vis-controls/selectors';

import api from './../api/';
import { datasets } from '@/configs/datasets';
import { DatasetId } from '@/types';
import { i18n } from '@/lang';

@Component({
    components: selectors
})
export default class MapViewControls extends Vue {
    @Getter getControls: string[];
    @State datasetId: DatasetId;

    showCollapse: boolean = false;

    tDSPath: string = 'downloadSelector';
    queryToolBaseUrl: string = '';

    get queryToolRoute(): string {
        return datasets[this.datasetId].queryToolRoute[<'en' | 'fr'>i18n.locale];
    }

    downloadImage(type: string): void {
        // TODO: is this reliable? Should we store a refernece to the map API in the store instead?
        api.RZ.mapInstances[api.RZ.mapInstances.length - 1].mapI.export(type);
    }

    async mounted(): Promise<void> {
        await $.getJSON('assets/configs/app-config.json', data => {
            this.queryToolBaseUrl = data.queryToolUrl;
        });
    }
}
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';
@import './../styles/view-controls.scss';
</style>
