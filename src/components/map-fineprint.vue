<template>
    <div class="cip-map-fineprint-container">

        <div class="cip-map-fineprint-content container">

            <span class="cip-attribution">{{ $t('geo.attribution') }}</span>

            <span class="cip-separator"></span>

            <!-- TODO: find out if any ARIA attributes are needed for the map scale -->
            
            <span class="cip-coordinates" v-if="cursorPoint.y !== 0 || cursorPoint.x !== 0">
                {{ cursorPointDMS.y }} {{ $t(`${tPath}.${ cursorPoint.y > 0 ? 'north' : 'south' }`) }} |
                {{ cursorPointDMS.x }} {{ $t(`${tPath}.${ 0 > cursorPoint.x ? 'west' : 'east' }`) }}
            </span>

            <button 
                class="cip-scale" 
                @click="isImperialScale = !isImperialScale"
                :aria-pressed="isImperialScale"
                :aria-label="$t('map.toggleScaleUnits')">

                <span class="cip-scale-line" :style="{ width: scale.width }"></span>
                {{ scale.label }}
            </button>

        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import { MapPoint } from '@/store/modules/app';
import { formatLatLong } from '@/globals/utils';

@Component
export default class MapFineprint extends Vue {
    // TODO: use proper type for map instance
    @Prop() cursorPoint: MapPoint;
    @Prop() resolution: number;

    tPath: string = 'geo.coordinates';

    /**
     * Convert lat/long in decimal degree to degree, minute, second.
     * Uses the 'formatLatLong' utils function
     */
    get cursorPointDMS(): { x: string; y: string } {
        const { y: lat, x: long } = this.cursorPoint;
        return formatLatLong(long, lat);
    }

    isImperialScale: boolean = false;

    /**
     * Calculates a scale bar for the current resolution.
     */
    get scale(): { label: string; width: string } {
        // the starting length of the scale line in pixels
        // reduce the length of the bar on extra small layouts
        const factor = window.innerWidth > 600 ? 70 : 35;

        // distance in meters
        const meters = this.resolution * factor;
        const metersInAMile = 1609.34;

        // get the distance in units, either miles or kilometers
        const units = this.resolution * factor / (this.isImperialScale ? metersInAMile : 1000);
        const unit = this.isImperialScale ? 'mi' : 'km';

        // length of the distance number
        const len = Math.round(units).toString().length;
        const div = Math.pow(10, len - 1);

        // we want to round the distance to the ceiling of the highest position and display a nice number
        // 45.637km => 50.00km; 4.368km => 5.00km
        // 28.357mi => 30.00mi; 2.714mi => 3.00mi
        const distance = Math.ceil(units / div) * div;

        // calcualte length of the scale line in pixels based on the round distance
        const pixels = distance * (this.isImperialScale ? metersInAMile : 1000) / this.resolution;

        return {
            width: `${pixels}px`,
            label: `${distance}${unit}`
        };
    }
}
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';

.cip-map-fineprint-container {
    background: rgba(255, 255, 255, 0.6);

    position: absolute;
    bottom: 0px;
    width: 100%;

    display: flex;
    justify-content: center;

    pointer-events: none;

    font-size: 1rem;
    color: #000;

    padding: 0 1rem;

    .cip-map-fineprint-content {
        width: 100%;
        display: flex;

        padding: 2px 0;
    }

    // clip the attribution line keeping the coordinates and scale intact
    .cip-attribution {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        position: relative;
        top: 1px;
    }

    .cip-coordinates {
        position: relative;
        top: 1px;
    }

    .cip-scale,
    .cip-coordinates {
        flex-shrink: 0;
    }

    .cip-separator {
        flex: 1;
        min-width: 15px;
    }

    .cip-scale {
        cursor: pointer;
        white-space: nowrap;
        outline-offset: -1px;
        background: transparent;
        border: 0;
        border-radius: 0;
        height: 20px;

        margin-left: 1.5rem;

        .cip-scale-line {
            display: inline-block;
            border: $border-colour-one 2px solid;
            border-top: none;
            height: 5px;
            margin-right: 2px;
        }
    }

    @media (max-width: 991px) {
        background: white;
    }
}
</style>
