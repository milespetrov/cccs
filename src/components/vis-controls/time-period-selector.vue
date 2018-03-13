<template>

    <base-selector class="cip-horizontal"
        :config="config"
        :available="available"
        :currentId="timePeriodId"
        tPath="timePeriodSelector"
        @select="select">
    </base-selector>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { mixins } from 'vue-class-component';

import BaseSelectorV from './base-selector.vue';
import api from './../../api/main';
import { UpdateRouteMixin } from './../../globals/mixin';
import {
    TimePeriodSelectorConfig,
    TimePeriodType,
    timePeriodSelectorConfig,
    VisualizationControlType,
    DatasetViewSource
} from '../../configs';

@Component({
    components: {
        'base-selector': BaseSelectorV
    }
})
export default class TimePeriodSelector extends mixins(UpdateRouteMixin) {
    @State timePeriodId: string;
    @State datasetId: string;
    @Getter datasetControlOptions: DatasetViewSource;
    @Action setTimePeriodId: (value: string) => void;

    config: TimePeriodSelectorConfig = timePeriodSelectorConfig;

    /**
     * Returns a list of time period options available for the currently selected dataset.
     */
    get available(): string[] | undefined {
        const selectorSource = this.datasetControlOptions[VisualizationControlType.Time];
        if (!selectorSource) {
            return;
        }

        return selectorSource.options;
    }

    select(value: TimePeriodType) {
        this.setTimePeriodId(value);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>

</style>
