<template>
    <div class="cip-controls-cluster-container">
        <div class="cip-controls-cluster" v-if="timeSliderLabels || colourRamp || legend || dateSlider">
            <div class="cip-cluster-row" v-if="legend">
                <!--div class="cip-row-label">
                    <span class="cip-label">{{ $t('map.controlsCluster.legend') }}</span>
                </div-->
                
                <div class="cip-row-content cip-row-legend" v-if="currentDataset == 'ltce' && !currentVariable.includes('station')">
                    <div>
                        <span v-html="legend[currentVariable][0]"></span>
                        <span>{{ $t(`${currentDataset}.${currentVariable}.shortName`) }}</span>
                    </div>
                    <div>
                        <span v-html="legend[currentVariable][1]"></span>
                        <span>{{ $t(`ltce.legend.newRecord`)}}</span>
                    </div>
                </div>
                <div class="cip-row-content cip-row-legend" v-else>
                    <span v-html="legend[currentVariable]"></span>
                    <span>{{ $t(currentDataset == 'ltce' ? `${currentDataset}.${currentVariable}.legend` : `${currentDataset}.${currentVariable}.shortName`) }}</span>
                </div>
            </div>

            <div class="cip-cluster-row" v-if="showTimeSlider">
                <div class="cip-row-label">
                    <span id="cip-timeSlider-label" class="cip-label">{{ $t('map.controlsCluster.timeline') }}</span>
                </div>
                <div class="cip-row-content">
                    <time-slider></time-slider>
                </div>
            </div>

            <div class="cip-cluster-row" v-if="dateSlider">
                <div class="cip-row-label">
                    <span id="cip-dateSlider-label" class="cip-label">{{ $t('map.controlsCluster.timeline') }}</span>
                </div>
                <div class="cip-row-content">
                    <date-slider v-bind="wmsTime"></date-slider>
                </div>
            </div>

            <!-- remove seprator if only one section is visible -->
            <span class="cip-separator-vertical" v-if="colourRamp && (showTimeSlider || dateSlider)"></span>

            <div class="cip-cluster-row" v-if="colourRamp">
                <div class="cip-row-label">
                    <span>{{ $t(`colourRamp.${currentDataset}.${currentVariable}`) }}</span>
                    <span>({{$t(`units.${currentDataset}.${currentVariable}.shortName`)}})</span>
                </div>
                <div class="cip-row-content">
                    <map-colour-ramp :labels="colourRamp.labels" :colours="colourRamp.colours" :ticks="colourRamp.ticks"></map-colour-ramp>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import {DatasetId, VariableId} from '@/types'

import TimeSlider from './time-slider.vue';
import MapColourRamp from './map-colour-ramp.vue';
import DateSlider from './date-slider.vue';

@Component({
    components: {
        'time-slider': TimeSlider,
        'map-colour-ramp': MapColourRamp,
        'date-slider': DateSlider
    }
})
export default class MapControlsCluster extends Vue {
    @Prop() timeSliderLabels: any;
    @Prop() colourRamp: any;
    @Prop() legend: any;
    @Prop() currentVariable: any;
    @Prop() currentDataset: any;
    @Prop() dateSlider: any;
    @Prop() wmsTime: any;


    get showTimeSlider(): boolean {
        return this.timeSliderLabels && (this.currentDataset !== DatasetId.DCS || ![VariableId.GrowingSeasonCool, VariableId.GrowingSeasonWarm, VariableId.GrowingSeasonOverwinter].includes(this.currentVariable))
    }
}
</script>

<style lang="scss" scoped>
@import "./../styles/variables.scss";

.cip-controls-cluster-container {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    pointer-events: none !important;
    font-size: 1.6rem;
    bottom: 1rem;

    .cip-controls-cluster {
        padding: 0.5rem 0;

        min-width: 500px;
        width: 50%;
        pointer-events: all;

        background-color: #fff;

        // TODO: create a shared variable for the box-shadow
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
            0px 2px 2px 0px rgba(0, 0, 0, 0.14),
            0px 3px 1px -2px rgba(0, 0, 0, 0.12);

        .cip-cluster-row {
            margin: 3px 0;
            min-height: 2.5rem;
            display: flex;
            align-items: center;

            .cip-row-label {
                font-size: 0.8em;
                flex: 1;
                color: $wet-secondary-text-colour;
            }

            .cip-row-content {
                flex: 2.9;
                span {
                    margin: 3px;
                }

                &.cip-row-legend {
                    text-align: center;
                }
            }

            .cip-row-label,
            .cip-row-content {
                padding: 0 15px;
                display: inline-block;
                line-height: normal;
            }
        }
    }

    // TODO: make a divider a shared component
    .cip-separator-vertical {
        width: 100%;
        height: 1px;
        display: block;
        background: rgba(0, 0, 0, 0.15);
        margin: 0.5rem 0;
    }

    @media (max-width: 768px) {
        bottom: 24px !important;

        .cip-controls-cluster {
            width: 100%;
            min-width: 300px;

            border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        }

        .cip-cluster-row {
            flex-direction: column;

            .cip-row-label {
                padding: 0.3rem 1.5rem 0.8rem 1.5rem !important;
            }

            .cip-row-content {
                width: 100%;
            }

            // IE flex bug: https://github.com/philipwalton/flexbugs#flexbug-7
            .cip-row-content,
            .cip-row-label {
                flex-basis: auto !important;
            }
        }
    }

    @media (min-width: 769px) and (max-width: 991px) {
        left: 1rem;
        right: 1rem;

        .cip-controls-cluster {
            width: 100%;
        }
    }
}
</style>
