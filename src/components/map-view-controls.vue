<template>
    <div class="cip-view-controls container">
        <div class="menu-option">
            <variable-selector></variable-selector>
        </div>

        <div class="menu-option">
            <dataset-selector></dataset-selector>
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

import VariableSelector from './variable-selector.vue';
import DatasetSelector from './dataset-selector.vue';

import api from './../api/main';

@Component({
    components: {
        VariableSelector,
        DatasetSelector
    }
})
export default class MapViewControls extends Vue {
    downloadImage(type: string): void {
        // TODO: trigger ramp export map image through API
    }
}
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';
@import './../styles/view-controls.scss';
</style>
