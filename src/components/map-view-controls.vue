<template>
    <div class="cip-view-controls">
        <button @click="showCollapse = !showCollapse" class="cip-controls-toggle btn btn-primary hidden-md hidden-lg">
            <span v-show="showCollapse">
                <font-awesome-icon icon="times" fixed-width/>
            </span>
            <span v-show="!showCollapse">
                <font-awesome-icon icon="sliders-h" fixed-width/>
            </span>
            <span class="cip-label">{{ $t('settings.title') }}</span>
        </button>

        <b-collapse class="cip-controls-wrapper" v-model="showCollapse" id="cip-view-controls-collapse">
            <div class="cip-controls">
                
                <div class="menu-option" v-for="controlRef in getControls" :key="`${controlRef}`">
                    <component :is="controlRef"></component>
                </div>

                <div class="menu-option">
                    <supplemental-selector />
                </div>
            </div>
        </b-collapse>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';

import selectors from './vis-controls/selectors';

import api from './../api/';
import { DatasetId, VariableId } from '@/types';
import { i18n } from '@/lang';

const StateApp = namespace('app', State);
const GetterApp = namespace('app', Getter);
const ActionApp = namespace('app', Action);
const StateData = namespace('data', State);

@Component({
    components: selectors
})
export default class MapViewControls extends Vue {
    @GetterApp
    getControls: string[];
    @StateApp
    datasetId: DatasetId;
    @StateApp
    variableId: VariableId;

    @StateData
    urlSuffixes: object | null;
    @StateData
    dataQueryUrl: string | null;
    @StateData
    dataCatalogueUrl: string | null;

    showCollapse: boolean = false;

    tDSPath: string = 'downloadSelector';

    get queryToolRoute(): string {
        if (!this.urlSuffixes || !this.datasetId) {
            return '';
        }
        return this.urlSuffixes[this.datasetId].dataQuery[<'en' | 'fr'>i18n.locale];
    }

    get metadataUUID(): string {
        if (!this.urlSuffixes || !this.datasetId) {
            return '';
        }
        if ([DatasetID.CMIP6, DatasetID.DCSu6].includes(this.datasetId)) {
            return this.urlSuffixes[this.datasetId].metadata[<'en' | 'fr'>i18n.locale];
        }
        return this.urlSuffixes[this.datasetId].metadata[this.variableId];
    }

    downloadImage(type: string): void {
        // TODO: is this reliable? Should we store a refernece to the map API in the store instead?
        api.RAMP.mapInstances[api.RAMP.mapInstances.length - 1].mapI.export(type);
    }
}
</script>

<style lang="scss" scoped>
@import "./../styles/variables.scss";
@import "./../styles/view-controls.scss";
</style>
