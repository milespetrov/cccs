<template>

    <base-selector
        :config="config"
        :currentId="datasetId"
        tPath="datasetSelector"
        itemTPath="datasetSelector"
        @select="select">
    </base-selector>
    
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';
import { mixins } from 'vue-class-component';

import BaseSelectorV from './base-selector.vue';
import { UpdateRouteMixin } from './../../globals/mixin';

import { DatasetId } from '@/types';
import { datasetSelectorConfig, DatasetSelectorConfig } from './../../configs/selectors';

const StateApp = namespace('app', State);
const GetterApp = namespace('app', Getter);
const ActionApp = namespace('app', Action);

@Component({
    components: {
        'base-selector': BaseSelectorV
    }
})
export default class DatasetSelector extends mixins(UpdateRouteMixin) {
    @ActionApp setDatasetId: (value: string) => void;
    @StateApp variableId: string;
    @StateApp datasetId: string;

    config: DatasetSelectorConfig = datasetSelectorConfig;

    select(value: DatasetId) {
        this.setDatasetId(value);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
@import './../../styles/variables.scss';
@import './../../styles/view-controls.scss';

.cip-dataset-selector {
    .dropdown-item {
        display: flex;
        align-items: center;
    }

    .cip-name {
        flex: 1;
        margin-right: 3rem;
    }

    .cip-short-name {
        font-size: 0.7em;
        font-weight: 100;
    }
}
</style>
