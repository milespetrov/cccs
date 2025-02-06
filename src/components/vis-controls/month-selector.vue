<template>

    <component :is='bodyOnly ? "selector-body" : "base-selector"'
        class="cip-horizontal"
        :config="config"
        :available="available"
        :currentId="month"
        tPath="monthSelector"
        itemTPath="monthSelector"
        @select="select" />

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';
import { mixins } from 'vue-class-component';

import BaseSelectorV from './base-selector.vue';
import { UpdateRouteMixin } from './../../globals/mixin';
import { MonthSelectorConfig, monthSelectorConfig } from '../../configs/selectors';

import { DatasetViewSource } from './../../configs/datasets';
import { TimePeriodType, VisualizationControlType } from '@/types';
import SelectorBodyV from './selector-body.vue';

const StateApp = namespace('app', State);
const GetterApp = namespace('app', Getter);
const ActionApp = namespace('app', Action);

@Component({
    components: {
        'base-selector': BaseSelectorV,
        'selector-body': SelectorBodyV
    }
})
export default class MonthSelector extends mixins(UpdateRouteMixin) {
    @StateApp month: string;
    @StateApp datasetId: string;
    @GetterApp datasetControlOptions: DatasetViewSource;
    @ActionApp setMonth: (value: string) => void;

    @Prop()
    bodyOnly: boolean;

    config: MonthSelectorConfig = monthSelectorConfig;

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
        this.setMonth(value);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
</style>
