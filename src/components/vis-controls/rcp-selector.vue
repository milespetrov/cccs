<template>

    <base-selector
        :config="config"
        :available="available"
        :currentId="rcpId"
        tPath="rcpSelector"
        @select="select">
    </base-selector>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import BaseSelectorV from './base-selector.vue';
import api from './../../api/';
import { Dictionary } from 'vue-router/types/router';
import { mixins } from 'vue-class-component';
import { UpdateRouteMixin } from './../../globals/mixin';

import {
    rcpSelectorConfig,
    RCPSelectorConfig,
    RCPType,
    VisualizationControlType,
    DatasetViewSource
} from './../../configs';

@Component({
    components: {
        'base-selector': BaseSelectorV
    }
})
export default class RcpSelector extends mixins(UpdateRouteMixin) {
    @State rcpId: string;
    @Getter datasetControlOptions: DatasetViewSource;
    @Action setRcpId: (value: RCPType) => void;

    config: RCPSelectorConfig = rcpSelectorConfig;

    /**
     * Returns a list of rcp options available for the currently selected dataset.
     */
    get available(): string[] | undefined {
        const selectorSource = this.datasetControlOptions[VisualizationControlType.RCP];
        if (!selectorSource) {
            return;
        }

        return selectorSource.options;
    }

    select(value: RCPType) {
        this.setRcpId(value);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
</style>
