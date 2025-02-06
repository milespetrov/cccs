<template>
    <component :is='bodyOnly ? "selector-body" : "base-selector"'
        :config="config"
        :available="available"
        :currentId="sspId"
        tPath="sspSelector"
        itemTPath="sspSelector"
        @select="select" />
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';

import BaseSelectorV from './base-selector.vue';
import { mixins } from 'vue-class-component';
import { UpdateRouteMixin } from './../../globals/mixin';

import { sspSelectorConfig, SSPSelectorConfig } from './../../configs/selectors';

import { DatasetViewSource } from './../../configs/datasets';
import { VisualizationControlType, SSPType } from '@/types';
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
export default class SspSelector extends mixins(UpdateRouteMixin) {
    @StateApp sspId: string;
    @GetterApp datasetControlOptions: DatasetViewSource;
    @ActionApp setSspId: (value: SSPType) => void;

    @Prop()
    bodyOnly: boolean;

    config: SSPSelectorConfig = sspSelectorConfig;

    /**
     * Returns a list of ssp options available for the currently selected dataset.
     */
    get available(): string[] | undefined {
        const selectorSource = this.datasetControlOptions[VisualizationControlType.SSP];
        if (!selectorSource) {
            return;
        }

        return selectorSource.options;
    }

    select(value: SSPType) {
        $('rv-details rv-details-header .rv-close').click(); // close the details panel
        this.setSspId(value);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
</style>
