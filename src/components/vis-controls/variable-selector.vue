<template>

    <base-selector
        :config="config"
        :available="available"
        :currentId="variableId"
        tPath="variableSelector"
        @select="select">
    </base-selector>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { mixins } from 'vue-class-component';

import BaseSelectorV from './base-selector.vue';

import api from '@/api/';
import { UpdateRouteMixin } from '@/globals/mixin';
import { variableSelectorConfig, VariableSelectorConfig } from './../../configs/selectors';
import { DatasetId, VariableId } from '@/types';
import { datasets } from '@/configs/datasets';

@Component({
    components: {
        'base-selector': BaseSelectorV
    }
})
export default class VariableSelector extends mixins(UpdateRouteMixin) {
    config: VariableSelectorConfig = variableSelectorConfig;

    @Action setVariableId: (value: string) => void;

    @State variableId: VariableId;
    @State datasetId: DatasetId;

    @Watch('datasetId')
    onDatasetChange() {
        if (!datasets[this.datasetId].variables.includes(this.variableId)) {
            this.select(datasets[this.datasetId].variables[0]);
        }
    }

    /**
     * Returns a list of variable options available for the currently selected dataset.
     */
    get available(): string[] | undefined {
        return datasets[this.datasetId].variables;
    }

    select(item: VariableId) {
        this.setVariableId(item);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
@import './../../styles/variables.scss';
@import './../../styles/view-controls.scss';
</style>
