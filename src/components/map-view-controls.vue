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

                <div role="group" aria-lableledby="map-image-export" :key="`group-a`">
                    <b-dropdown-header id="map-image-export">Map image</b-dropdown-header>

                    <b-dropdown-item-button @click="downloadImage('png', true)">PNG picture</b-dropdown-item-button>
                    <b-dropdown-item-button @click="downloadImage('jpg', true)">JPEG picure</b-dropdown-item-button>
                </div>

                <b-dropdown-divider></b-dropdown-divider>

                <div role="group" aria-lableledby="map-data-export" :key="`group-b`">
                    <b-dropdown-header id="map-data-export">Dataset</b-dropdown-header>

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
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import BaseSelectorV from './vis-controls/base-selector.vue';
import selectors from './vis-controls/selectors';

import api from './../api/';

@Component({
    components: selectors
})
export default class MapViewControls extends Vue {
    @Getter getControls: string[];

    downloadImage(type: string): void {
        api.RZ.mapInstances[api.RZ.mapInstances.length - 1].mapI.export(type);
    }
}
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';
@import './../styles/view-controls.scss';
</style>
