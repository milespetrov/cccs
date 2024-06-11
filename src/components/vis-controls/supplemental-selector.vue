<template>

    <b-dropdown variant="light" right class="cip-dropdown-right cip-selector" no-flip>

        <template slot="button-content">
            <div class="cip-content-wrap">
                <span class="cip-selected-value">{{ $t(`${config.id}.title`) }}</span>
            </div>
        </template>
 
            <div role="group" aria-lableledby="supplemental-data" :key="`sup-group`">
                <b-dropdown-item-button
                    v-for="layerId in config.items"
                    class="cip-nowrap"
                    :class="{ 'cip-selected': layerId === currentSupplementalId }"
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

import BaseSelectorV from './base-selector.vue';
import { UpdateRouteMixin } from './../../globals/mixin';

import { SupplementalId } from '@/types';
import {
    supplementalLayersEn,
    supplementalLayersFr,
    SupplementalLayers,
    supplementalSelectorConfig,
    SupplementalSelectorConfig
} from './../../configs/selectors';

const StateApp = namespace('app', State);
const ActionApp = namespace('app', Action);

@Component({
    components: {
        'base-selector': BaseSelectorV
    }
})
export default class SupplementalSelector extends mixins(UpdateRouteMixin) {
    @ActionApp setSupplementalIds: (value: string[]) => void;
    @StateApp supplementalIds: string[];

    config: SupplementalSelectorConfig = supplementalSelectorConfig;
    layersEn: SupplementalLayers = supplementalLayersEn;
    layersFr: SupplementalLayers = supplementalLayersFr;

    initialLoad: boolean = true;
    currentSupplementalId: string = '';
    selected = {
        np: false,
        ntsn: false,
        cdd: false,
        atris: false
    };

    // serves purpose to watch if bookmarked ids exist on initial load
    @Watch('supplementalIds')
    async onSupplementalChange(newVals: string[], oldVals: string[]) {
        if (this.initialLoad) {
            // wait for map instance to be initialized
            // better solution than timeout would probably involve changing the initial app loadup sequence
            // to guarantee map instance is initialized before any bookmarking decoding process is done
            setTimeout(() => {
                newVals.forEach((layerId: string) => {
                    this.selected[layerId] = true;
                    this.addLayer(layerId.toUpperCase());
                });
                
                this.initialLoad = false;
            }, 500);
        }
    }

    select(layerId: SupplementalId) {
        this.initialLoad = false;
        this.selected[layerId] = !this.selected[layerId]
        this.selected[layerId] ? this.addLayer(layerId.toUpperCase()) : this.removeLayer(layerId.toUpperCase());

        // update state/bookmark for supplemental IDs
        const selectedIds = Object.keys(this.selected).filter(key => this.selected[key] === true);
        this.setSupplementalIds(selectedIds);
        this.updateRoute();
    }

    addLayer(layerId: string): void {
        const rInstance = (<any>window).debugInstance;
        if (rInstance) {
            // construct layer object and add to map/legend
            const layerConfig = this.$i18n.locale === 'en' ? this.layersEn[layerId] : this.layersFr[layerId];
            const layerToAdd = rInstance.geo.layer.createLayer(layerConfig);
            rInstance.geo.map.addLayer(layerToAdd); 
            rInstance.fixture.get('legend').addLayerItem(layerToAdd);
        }
    }

    removeLayer(layerId: string): void {
        const rInstance = (<any>window).debugInstance;
        if (rInstance) {
            // remove layer from map/legend
            const layerConfig = this.$i18n.locale === 'en' ? this.layersEn[layerId] : this.layersFr[layerId];
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
</style>
