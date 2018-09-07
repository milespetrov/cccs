<template>

    <base-selector class="cip-horizontal"
        :config="config"
        :available="available"
        :currentId="timePeriodId"
        tPath="timePeriodSelector"
        itemTPath="timePeriodSelector"
        @select="select">
    </base-selector>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';
import { mixins } from 'vue-class-component';

import BaseSelectorV from './base-selector.vue';
import { UpdateRouteMixin } from './../../globals/mixin';
import { TimePeriodSelectorConfig, timePeriodSelectorConfig } from '../../configs/selectors';

import { DatasetViewSource } from './../../configs/datasets';
import { TimePeriodType, VisualizationControlType } from '@/types';

const StateApp = namespace('app', State);
const GetterApp = namespace('app', Getter);
const ActionApp = namespace('app', Action);

@Component({
    components: {
        'base-selector': BaseSelectorV
    }
})
export default class TimePeriodSelector extends mixins(UpdateRouteMixin) {
    @StateApp timePeriodId: string;
    @StateApp datasetId: string;
    @GetterApp datasetControlOptions: DatasetViewSource;
    @ActionApp setTimePeriodId: (value: string) => void;

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
        $('rv-details rv-details-header .rv-close').click(); // close the details panel
        this.setTimePeriodId(value);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
</style>
