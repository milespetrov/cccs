<template>

    <base-selector class="cip-horizontal"
        :config="config"
        :available="available"
        :currentId="day"
        tPath="daySelector"
        itemTPath="daySelector"
        @select="select">
    </base-selector>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';
import { mixins } from 'vue-class-component';

import BaseSelectorV from './base-selector.vue';
import { UpdateRouteMixin } from './../../globals/mixin';
import { DaySelectorConfig, daySelectorConfig } from '../../configs/selectors';

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
export default class DaySelector extends mixins(UpdateRouteMixin) {
    @StateApp day: string;
    @StateApp month: string;
    @StateApp datasetId: string;
    @GetterApp datasetControlOptions: DatasetViewSource;
    @ActionApp setDay: (value: string) => void;

    config: DaySelectorConfig = daySelectorConfig;

    /**
     * Returns a list of time period options available for the currently selected dataset.
     */
    get available(): string[] | undefined {
        const selectorSource = this.datasetControlOptions[VisualizationControlType.Day];
        if (!selectorSource) {
            return;
        }

        let options;
        if (this.month === TimePeriodType.February) {
            options = selectorSource!.options!.slice(0,29);
        } else if ([TimePeriodType.April, TimePeriodType.June, TimePeriodType.September, TimePeriodType.November].includes(this.month as TimePeriodType)) {
            options = selectorSource!.options!.slice(0,30);
        } else {
            options = selectorSource!.options!;
        }

        return options;
    }

    select(value: string) {
        $('rv-details rv-details-header .rv-close').click(); // close the details panel
        this.setDay(value);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
</style>
