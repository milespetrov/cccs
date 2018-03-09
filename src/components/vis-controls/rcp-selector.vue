<template>
    <!-- <b-dropdown :text="selectedRcpShortName" variant="light" class="cip-rcp-selector">

        <div class="cip-dropdown-info">
            <h6 class="dropdown-header">RCP</h6>
            <div class="cip-dropdown-description">The Coupled Model Intercomparison Project Phase 5 (CMIP5) projections make use of Representative Concentration Pathways (RCPs), which are designed to provide plausible future scenarios of anthropogenic forcing.</div>
        </div>

        <b-dropdown-divider></b-dropdown-divider>

        <b-dropdown-item-button
            v-for="rcp in rcpItems"
            :key="`rcp-${ rcp.id }`"
            @click="selectRcp(rcp)"
            :disabled="rcp.id === rcpId"
            :class="{ 'cip-selected': rcp.id === rcpId }">
                <span class="cip-name">{{ rcp.name }}</span>
                <span class="cip-short-name">{{ rcp.shortName }}</span></b-dropdown-item-button>

    </b-dropdown> -->

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
@import './../../styles/variables.scss';
@import './../../styles/view-controls.scss';

.cip-rcp-selector {
    .dropdown-item {
        display: flex;
        align-items: center;
    }

    .cip-name {
        flex: 1;
        margin-right: 3rem;
    }

    .cip-short-name {
        font-size: 0.7em;
        font-weight: 100;
    }
}
</style>
