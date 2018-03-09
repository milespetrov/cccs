<template>

    <base-selector class="cip-horizontal"
        :config="config"
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
import { Dictionary } from 'vue-router/types/router';
import { UpdateRouteMixin } from './../../globals/mixin';
import { TimePeriodSelectorConfig, TimePeriodType, timePeriodSelectorConfig } from '../../configs/index';

@Component({
    components: {
        'base-selector': BaseSelectorV
    }
})
export default class TimePeriodSelector extends mixins(UpdateRouteMixin) {
    @Action setTimePeriodId: (value: string) => void;
    @State timePeriodId: string;

    config: TimePeriodSelectorConfig = timePeriodSelectorConfig;

    select(value: TimePeriodType) {
        this.setTimePeriodId(value);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>

</style>
