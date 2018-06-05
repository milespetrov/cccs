<template>
    <div class="cip-view-controls">

        <div class="menu-option" v-for="controlRef in getControls" :key="`${controlRef}`">
            <component :is="controlRef"></component>
        </div>

        <span class="separator"></span>

        <div class="menu-option">
            <b-dropdown variant="light" right>
                <template slot="button-content">
                    <div class="cip-content-wrap">
                        <span class="cip-selected-value">Download</span>
                    </div>
                </template>
                
                <div class="cip-dropdown-multi-item">
                    <span>Export Map Image</span>

                    <div class="cip-dropdown-multi-item-options">
                        <b-dropdown-item-button @click="downloadImage('png', true)">.png</b-dropdown-item-button>
                        <b-dropdown-item-button @click="downloadImage('jpg', true)">.jpg</b-dropdown-item-button>
                    </div>
                </div>

                <b-dropdown-divider></b-dropdown-divider>

                <b-dropdown-item>Access full dataset in Catalogue</b-dropdown-item>
            </b-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

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
