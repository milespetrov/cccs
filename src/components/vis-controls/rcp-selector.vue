<template>

    <base-selector
        :config="config"
        :currentId="rcpId"
        tPath="rcpSelector"
        @select="select">
    </base-selector>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import BaseSelectorV from './base-selector.vue';
import api from './../../api/main';
import { Dictionary } from 'vue-router/types/router';
import { mixins } from 'vue-class-component';
import { UpdateRouteMixin } from './../../globals/mixin';

import { rcpSelectorConfig, RCPSelectorConfig, RCPType } from './../../configs';

@Component({
    components: {
        'base-selector': BaseSelectorV
    }
})
export default class RcpSelector extends mixins(UpdateRouteMixin) {
    @Action setRcpId: (value: RCPType) => void;
    @State rcpId: string;

    config: RCPSelectorConfig = rcpSelectorConfig;

    select(value: RCPType) {
        this.setRcpId(value);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>

</style>
