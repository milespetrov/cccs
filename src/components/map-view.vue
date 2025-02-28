<template>
    <div class="cip-map-view">

        <div class="cip-strip cip-backdrop-map">
            <map-instance :key="`instance-${reloadKey}`" :map-counter="`${reloadKey}`"></map-instance>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import api from './../api/';
import { VariableId } from '@/types';

import MapInstance from './map-instance.vue';

const StateApp = namespace('app', State);

@Component({
    components: {
        MapInstance
    }
})
export default class MapView extends Vue {
    @StateApp datasetId: string;
    @StateApp('variableId') variableId: VariableId;

    /**
     * The map component will be force-reloaded on the `reloadKey` change.
     */
    reloadKey: number = 0;

    @Watch('datasetId')
    onDatasetChange(newValue: string) {
        api.dcsMultiTrack(
            'DCSext.cccs_dataset_selected',
            newValue,
            'DCSext.cccs_datavar_set',
            `${newValue}-${this.variableId}`,
            'WT.ti',
            `${newValue} selected with ${this.variableId}.`
        );
        this.reloadKey += 1;
    }
}
</script>


<style lang="scss" scoped>
@import './../styles/variables.scss';
.cip-map-view {
    border-bottom: 3px solid $border-colour-two;
}

.cip-map-view /deep/ {
    div[data-cy='grid'] {
        opacity: 0.9 !important;
    }
}
</style>
