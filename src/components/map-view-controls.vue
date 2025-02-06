<template>
    <div class="cip-view-controls">
        <button @click="showCollapse = !showCollapse" class="cip-controls-toggle btn btn-primary hidden-md hidden-lg">
            <span v-show="showCollapse">
                <font-awesome-icon icon="times" fixed-width />
            </span>
            <span v-show="!showCollapse">
                <font-awesome-icon icon="sliders-h" fixed-width />
            </span>
            <span class="cip-label">{{ $t('settings.title') }}</span>
        </button>

        <b-collapse class="cip-controls-wrapper" id="cip-view-controls-collapse" v-model="showCollapse">
            <div class="cip-controls">
                <b-dropdown ref="discovery-menu" variant="light" class="cip-selector desktop-menu" no-flip>
                    <template slot="button-content">
                        <div class="cip-content-wrap">
                            <span class="cip-selected-value">{{$t(`datasetSelector.${datasetId}.shortName`)}}</span>
                            <div class="cip-value-label-wrapper">
                                <template v-for="(controlRef, index) in getControls.slice(1)">
                                    <span class="cip-value-divider" v-if="index !== 0" :key="`${controlRef}-divider`" />
                                    <span class="cip-value-label" :key="`${controlRef}`">{{$t(`${buttonTPath(controlRef)}.shortName`)}}</span>
                                </template>
                            </div>
                        </div>
                    </template>

                    <div class="menu-wrapper">
                        <div class="menu-option" v-for="controlRef in getControls" :key="`${controlRef}`">
                            <div class="menu-header-row">
                                <span class="menu-header-text">{{$t(`${headerTPath(controlRef)}.title`)}}</span>
                                <div v-if="controlRef === 'dataset-selector'">
                                    <!-- dataset filter dropdown here -->
                                </div>
                            </div>
                            <component :is="controlRef" :bodyOnly="true"/>
                        </div>
                    </div>

                    <button data-v-2942f9ed="" class="close-button" @click="$refs['discovery-menu'].hide()" :aria-label="$t('controls.close')">
                        <svg data-v-2942f9ed="" xmlns="http://www.w3.org/2000/svg" height="24px"
                            viewBox="0 -960 960 960" width="24px" fill="rgb(51, 51, 51)">
                            <path data-v-2942f9ed=""
                                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z">
                            </path>
                        </svg>
                    </button>
                </b-dropdown>

                <div class="menu-option mobile-menu" v-for="controlRef in getControls" :key="`${controlRef}`">
                        <component :is="controlRef"  :bodyOnly="false"/>
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
    @StateApp
    timePeriodId: string | null;
    @StateApp
    rcpId: string | null;
    @StateApp
    sspId: string | null;
    @StateApp
    month: string | null;
    @StateApp
    day: string | null;
    @StateApp
    analysisPeriod: string | null;

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
        return (this.urlSuffixes as any)[this.datasetId].dataQuery[<'en' | 'fr'>i18n.locale];
    }

    get metadataUUID(): string {
        if (!this.urlSuffixes || !this.datasetId) {
            return '';
        }
        if ([DatasetId.CMIP6, DatasetId.DCSu6].includes(this.datasetId)) {
            return (this.urlSuffixes as any)[this.datasetId].metadata[<'en' | 'fr'>i18n.locale];
        }
        return (this.urlSuffixes as any)[this.datasetId].metadata[this.variableId];
    }

    /**
     *  Get translation path for the given control
     */ 
    headerTPath(controlName: string): string {
        // turns 'dataset-selector' into 'datasetSelector'
        return controlName.replace(/-[a-z]/g, (match) => {
            return match.slice(1).toUpperCase()
        })
    }

    buttonTPath(controlName: string): string {
        const mapping = {
            'analysis-period-selector': this.analysisPeriod,
            'day-selector': this.day,
            'month-selector': this.month,
            'rcp-selector': this.rcpId,
            'ssp-selector': this.sspId,
            'time-period-selector': this.timePeriodId
        }

        if (controlName === 'variable-selector') {
            return this.datasetId + '.' + this.variableId;
        }

        return this.headerTPath(controlName) + '.' + mapping[controlName];
    }

    downloadImage(type: string): void {
        // TODO: is this reliable? Should we store a refernece to the map API in the store instead?
        api.RAMP.mapInstances[api.RAMP.mapInstances.length - 1].mapI.export(type);
    }
}
</script>

<style lang="scss" scoped>
.desktop-menu {
    .cip-value-label-wrapper {
        display: flex;
    }
    .cip-value-label,.cip-value-divider {
        margin-right: 5px;
    }
    .cip-value-divider {
        border-right: 1px solid;
    }
    .menu-header-row {
        margin-right: 10px;
        margin-left: 10px;

        .menu-header-text {
            margin-left: 15px;
            font-weight: 700;
            font-size: 1.3em;
        }
    }
    .close-button {
        position: absolute;
        right: 5px;
        top: 5px;
        border: none;
        background: none;
        height: 24px;
        width: 24px;
        margin: 0;
        padding: 0;
    }
    .menu-wrapper {
        display: flex;
        max-width: calc(90vw - 2px);
        width: max-content;
        font-size: 0.9em;

        .menu-option {
            min-width: 200px;
        }

        // Dataset selector
        .menu-option:first-child {
            flex-shrink: 1;
        }

        .menu-option:nth-child(n + 2) {
            flex-shrink: 2;
        }

        // big divider between Dataset and options
        .menu-option:nth-child(n + 2)>div:nth-child(2):before {
            position: absolute;
            margin-top: 25px;
            margin-bottom: 10px;
            top: 0;
            bottom: 0;
            width: 6px;
            content: '';
            background-color: #878686;
        }

        // small divider between options
        .menu-option:nth-child(n + 3)>div:nth-child(2):before {
            width: 1px;
        }
    }
}

@import "./../styles/variables.scss";
@import "./../styles/view-controls.scss";
</style>
