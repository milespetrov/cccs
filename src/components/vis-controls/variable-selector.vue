<template>
    <base-selector
        :config="config"
        :available="available"
        :currentId="variableId"
        :tPath="tPath"
        :itemTPath="datasetId"
        @select="select"
    ></base-selector>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';
import { mixins } from 'vue-class-component';

import BaseSelectorV from './base-selector.vue';

import { UpdateRouteMixin } from '@/globals/mixin';
import { variableSelectorConfig, VariableSelectorConfig } from './../../configs/selectors';
import { DatasetId, VariableId } from '@/types';
import { datasets } from '@/configs/datasets';

const StateApp = namespace('app', State);
const GetterApp = namespace('app', Getter);
const ActionApp = namespace('app', Action);

@Component({
    components: {
        'base-selector': BaseSelectorV
    }
})
export default class VariableSelector extends mixins(UpdateRouteMixin) {
    config: VariableSelectorConfig = variableSelectorConfig;

    @ActionApp setVariableId: (value: string) => void;

    @StateApp variableId: VariableId;
    @StateApp datasetId: DatasetId;

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

    get tPath() {
        if (!this.datasetId) {
            return 'variableSelector';
        }
        return 'variableSelector' + ((this.datasetId === 'normal' || this.datasetId === 'ltce') ? `.${this.datasetId}` : '');
    }

    select(item: VariableId) {
        $('rv-details rv-details-header .rv-close').click(); // close the details panel
        this.setVariableId(item);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
@import "./../../styles/variables.scss";
@import "./../../styles/view-controls.scss";
</style>
