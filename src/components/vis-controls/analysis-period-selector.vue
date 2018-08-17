<template>

    <base-selector
        :config="config"
        :available="available"
        :currentId="analysisPeriod"
        tPath="analysisSelector"
        itemTPath="analysisSelector"
        @select="select">
    </base-selector>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import BaseSelectorV from './base-selector.vue';
import { Dictionary } from 'vue-router/types/router';
import { mixins } from 'vue-class-component';
import { UpdateRouteMixin } from './../../globals/mixin';

import { RCPSelectorConfig, analysisperiodSelectorConfig } from './../../configs/selectors';

import { DatasetViewSource } from './../../configs/datasets';
import { VisualizationControlType, AnalysisPeriodType } from '@/types';

@Component({
    components: {
        'base-selector': BaseSelectorV
    }
})
export default class AnalysisPeriodSelector extends mixins(UpdateRouteMixin) {
    @State analysisPeriod: string;
    @Getter datasetControlOptions: DatasetViewSource;
    @Action setAnalysisPeriod: (value: AnalysisPeriodType) => void;

    config: RCPSelectorConfig = analysisperiodSelectorConfig;

    /**
     * Returns a list of rcp options available for the currently selected dataset.
     */
    get available(): string[] | undefined {
        const selectorSource = this.datasetControlOptions[VisualizationControlType.Analysis];
        if (!selectorSource) {
            return;
        }

        return selectorSource.options;
    }

    select(value: AnalysisPeriodType) {
        this.setAnalysisPeriod(value);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
</style>
