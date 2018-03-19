<template>
    <b-dropdown :text="$t(`${tPath}.title`, { current: $t(`${tPath}.${variableId}.shortName`) })" variant="light" class="cip-variable-selector">

        <div class="cip-dropdown-info">
            <h6 class="dropdown-header">{{ $t(`${tPath}.header`) }}</h6>
            <div class="cip-dropdown-description">{{ $t(`${tPath}.description`) }}</div>
        </div>

        <b-dropdown-divider></b-dropdown-divider>

        <template v-for="(group, index) in config.groups">
            <b-dropdown-divider :key="`divider-${ group.id }`" v-if="index !== 0"></b-dropdown-divider>

            <div role="group" :aria-lableledby="group.id" :key="`group-${ group.id }`">
                <b-dropdown-header :id="group.id" v-if="group.items.length > 1">{{ $t(`${tPath}.${group.id}`) }}</b-dropdown-header>

                <div class="cip-dropdown-multi-item" v-for="item in group.items" :key="`item-${ item }`">
                    <span>{{ $t(`${tPath}.${item}.fullName`) }}</span>

                    <div class="cip-dropdown-multi-item-options">
                        
                        <!-- TODO: need to set aria attribute on the button or add a hidden label because multiple buttons have the same text: Historic or Future -->

                        <template v-for="(stageDatasets, key) in stages[item]">
                            <b-dropdown-item-button
                                :key="`stage-${key}`"
                                :aria-describedby="group.id"
                                v-if="stageDatasets.length > 0"
                                :disabled="isStageDisabled(item, stageDatasets)"
                                :class="{ 'cip-selected': isStageDisabled(item, stageDatasets) }"
                                @click="selectVariable(item, stageDatasets)">{{ $t(`${tPath}.${key}`) }}</b-dropdown-item-button>

                        </template>
                    </div>
                </div>
            </div>

        </template>

    </b-dropdown>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { mixins } from 'vue-class-component';

import api from './../../api/';
import { Dictionary } from 'vue-router/types/router';
import { UpdateRouteMixin } from './../../globals/mixin';
import {
    variableSelectorConfig,
    stages,
    StageMapping,
    VariableSelectorConfig,
    DatasetId,
    StageType,
    VariableId
} from '../../configs';

@Component
export default class VariableSelector extends mixins(UpdateRouteMixin) {
    tPath: string = 'variableSelector';
    config: VariableSelectorConfig = variableSelectorConfig;
    stages: StageMapping = stages;

    @Action setVariableId: (value: string) => void;
    @Action setDatasetId: (value: string) => void;

    @State variableId: string;
    @State datasetId: DatasetId;

    isStageDisabled(item: VariableId, stageDatasets: DatasetId[]): boolean {
        return item === this.variableId && stageDatasets.includes(this.datasetId);
    }

    selectVariable(item: VariableId, stageDatasets: DatasetId[]) {
        this.setVariableId(item);
        this.setDatasetId(stageDatasets[0]);

        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
@import './../../styles/variables.scss';
@import './../../styles/view-controls.scss';

.b-dropdown .cip-dropdown-multi-item-options {
    width: 16em !important;
}
</style>
