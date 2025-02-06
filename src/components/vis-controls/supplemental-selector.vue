<template>

    <b-dropdown variant="light" right class="cip-dropdown-right cip-selector" no-flip>

        <template slot="button-content">
            <div class="cip-content-wrap">
                <span class="cip-selected-value">{{ $t(`${config.id}.title`) }}</span>
            </div>
        </template>
 
            <div class="cip-supplemental-content" role="group" aria-lableledby="supplemental-data" :key="`sup-group`">
                <b-dropdown-item-button
                    v-for="layerId in config.items"
                    @click="select(layerId)"
                    :key="`item-${ layerId }`">
                        <span class="cip-name">
                            <span class="cip-first">{{ $t(`${config.id}.${layerId}.fullName`) }}</span>
                            <span 
                                class="cip-second cip-subname">{{ $t(`${config.id}.${layerId}.subName`) }}</span>
                        </span>
                        <font-awesome-icon icon="check" v-if="selected[layerId]"/>
                </b-dropdown-item-button>
            </div>

    </b-dropdown>
    
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import { mixins } from 'vue-class-component';

import { UpdateRouteMixin } from './../../globals/mixin';

import { SupplementalId } from '@/types';
import {
    SupplementalLayers,
    supplementalSelectorConfig,
    SupplementalSelectorConfig
} from './../../configs/selectors';

const StateApp = namespace('app', State);
const ActionApp = namespace('app', Action);

const StateData = namespace('data', State);

@Component
export default class SupplementalSelector extends mixins(UpdateRouteMixin) {
    @ActionApp setSupplementalIds: (value: string[]) => void;
    @StateApp supplementalIds: string[];
    @StateData supplementalLayers: {[key:string]: SupplementalLayers};

    config: SupplementalSelectorConfig = supplementalSelectorConfig;

    selected = {
        np: false,
        ntsn: false,
        cdd: false,
        atris: false
    };

    // serves to toggle on any previously selected ids on map reload or initial app load
    @Watch('supplementalIds')
    onSupplementalChange(newVals: string[], oldVals: string[]) {
        newVals.forEach((layerId: string) => {
            this.selected[layerId.toLowerCase()] = true;
        });
    }

    select(layerId: SupplementalId) {
        this.selected[layerId] = !this.selected[layerId]
        this.selected[layerId] ? this.addLayer(layerId.toUpperCase()) : this.removeLayer(layerId.toUpperCase());

        // update state/bookmark for supplemental IDs
        const selectedIds = (Object.keys(this.selected).filter(key => this.selected[key] === true)).map((id: string) =>
            id.toUpperCase()
        );
        this.setSupplementalIds(selectedIds);
        this.updateRoute();
    }

    addLayer(layerId: string): void {
        // NOTE: option to move this layer-related code to map-instance to avoid relying on debugInstance
        // however, should not impact any functionality as having it here just simplifies the code instead
        // of having to rely on a watcher or multiple watchers
        const rInstance = (<any>window).debugInstance;
        if (rInstance) {
            // construct layer object and add to map/legend
            const layerConfig = this.supplementalLayers[this.$i18n.locale][layerId];
            const layerToAdd = rInstance.geo.layer.createLayer(layerConfig);
            rInstance.geo.map.addLayer(layerToAdd); 
            rInstance.fixture.get('legend').addLayerItem(layerToAdd);
        }
    }

    removeLayer(layerId: string): void {
        const rInstance = (<any>window).debugInstance;
        if (rInstance) {
            // remove layer from map/legend
            const layerConfig = this.supplementalLayers[this.$i18n.locale][layerId];
            rInstance.geo.map.removeLayer(layerConfig.id);
            rInstance.fixture.get('legend').removeLayerItem(layerConfig.id)
        }
    }
}
</script>

<style lang="scss" scoped>
@import './../../styles/variables.scss';
@import './../../styles/view-controls.scss';

.cip-subname {
    white-space: normal;
}

.cip-supplemental-content {
    min-width: 400px;
    max-width: 700px;
    width: max-content;
}
</style>
