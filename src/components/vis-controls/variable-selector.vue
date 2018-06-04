<template>
    <b-dropdown :text="$t(`${tPath}.title`, { current: $t(`${tPath}.${variableId}.shortName`) })" variant="light" class="cip-variable-selector">

        <div class="cip-dropdown-info">
            <h6 class="dropdown-header">{{ $t(`${tPath}.header`) }}</h6>
            <div class="cip-dropdown-description">{{ $t(`${tPath}.description`) }}</div>
        </div>

        <template v-for="(group) in config.groups" v-if="group.items.some(item => datasetVariables.includes(item))">
            <b-dropdown-divider :key="`divider-${ group.id }`"></b-dropdown-divider>

            <div role="group" :aria-lableledby="group.id" :key="`group-${ group.id }`">
                <b-dropdown-header :id="group.id">{{ $t(`${tPath}.${group.id}`) }}</b-dropdown-header>
                        <template v-for="item in group.items">
                            <b-dropdown-item-button
                                :key="`stage-${item}`"
                                :aria-describedby="group.id"
                                v-if="datasetVariables.includes(item)"
                                :disabled="isSelected(item)"
                                :class="{ 'cip-selected': isSelected(item) }"
                                @click="selectVariable(item)">{{ $t(`${tPath}.${item}.fullName`) }}</b-dropdown-item-button>

                        </template>
                    </div>

        </template>

    </b-dropdown>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { mixins } from 'vue-class-component';

import api from '@/api/';
import { Dictionary } from 'vue-router/types/router';
import { UpdateRouteMixin } from '@/globals/mixin';
import { variableSelectorConfig, VariableSelectorConfig } from './../../configs/selectors';
import { DatasetId, VariableId } from '@/types';
import { datasets } from '@/configs/datasets';

@Component
export default class VariableSelector extends mixins(UpdateRouteMixin) {
    tPath: string = 'variableSelector';
    config: VariableSelectorConfig = variableSelectorConfig;

    @Action setVariableId: (value: string) => void;

    @State variableId: VariableId;
    @State datasetId: DatasetId;

    @Watch('datasetId')
    onDatasetChange() {
        if (!datasets[this.datasetId].variables.includes(this.variableId)) {
            this.selectVariable(datasets[this.datasetId].variables[0]);
        }
    }

    isSelected(item: VariableId): boolean {
        return item === this.variableId;
    }

    //datasetVariables = datasets[this.datasetId].variables;
    selectVariable(item: VariableId) {
        this.setVariableId(item);

        this.updateRoute();
    }

    get datasetVariables() {
        return datasets[this.datasetId].variables;
    }
}
</script>

<style lang="scss" scoped>
@import './../../styles/variables.scss';
@import './../../styles/view-controls.scss';
</style>
