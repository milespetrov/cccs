<template>
    <b-dropdown :text="selectedRcpShortName" variant="light" class="cip-rcp-selector">

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

    </b-dropdown>
    
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import api from './../../api/main';
import { Dictionary } from 'vue-router/types/router';
import { mixins } from 'vue-class-component';
import { UpdateRouteMixin } from './../../globals/mixin';

interface RcpItem {
    name: string;
    shortName: string;
    id: string;
}

@Component
export default class RcpSelector extends mixins(UpdateRouteMixin) {
    rcpItems: RcpItem[] = [
        {
            name: 'Representative Concentration Pathway 2.6',
            shortName: 'RCP 2.6',
            id: 'rcp2.6'
        },
        {
            name: 'Representative Concentration Pathway 4.5',
            shortName: 'RCP 4.5',
            id: 'rcp4.5'
        },
        {
            name: 'Representative Concentration Pathway 8.5',
            shortName: 'RCP 8.5',
            id: 'rcp8.5'
        }
    ];

    @Action setRcpId: (value: string) => void;
    @State rcpId: string;

    get selectedRcpShortName(): string {
        // select a default Rcp
        // TODO: revisit once we decide how to handle defaults/leaving out variables
        if (this.rcpId == undefined) {
            this.selectRcp(this.rcpItems[0]);
        }
        return `Model: ${this.rcpItems.find(rcp => rcp.id === this.rcpId)!.shortName}`;
    }

    selectRcp(rcp: RcpItem) {
        this.setRcpId(rcp.id);
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
