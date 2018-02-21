<template>
    <div class="cip-view-controls container">

        <div class="menu-option" v-for="controlRef in getControls" :key="`${controlRef}`">
            <component :is="controlRef"></component>
        </div>

        <span class="separator"></span>

        <div class="menu-option">
            <b-dropdown text="Download" variant="light" right>
                <div class="cip-dropdown-multi-item">
                    <span>Export Map Image</span>

                    <div class="cip-dropdown-multi-item-options">
                        <b-dropdown-item-button @click="downloadImage('png', true)">.png</b-dropdown-item-button>
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

import api from './../api/main';

@Component({
    components: selectors
})
export default class MapViewControls extends Vue {
    @Getter getControls: string[];

    downloadImage(type: string): void {
        api.RZ.mapInstances[api.RZ.mapInstances.length - 1].export();
    }
}
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';
@import './../styles/view-controls.scss';
</style>
