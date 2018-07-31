<template>
    <div class="cip-map-fineprint-container">

        <div class="cip-map-fineprint-content container">

            <span class="cip-attribution">{{ $t('geo.attribution') }}</span>

            <span class="cip-separator"></span>

            <!-- TODO: find out if any ARIA attributes are needed for the map scale -->
            <span class="cip-scale">
                <span class="cip-scale-line" :style="{ width: scale.width }"></span>
                {{ scale.label }}
            </span>

            <span class="cip-coordinates" v-if="cursorPoint.y !== 0 || cursorPoint.x !== 0">
                {{ cursorPointDMS.y }} {{ $t(`${tPath}.${ cursorPoint.y > 0 ? 'north' : 'south' }`) }} |
                {{ cursorPointDMS.x }} {{ $t(`${tPath}.${ 0 > cursorPoint.x ? 'west' : 'east' }`) }}
            </span>

            <!-- TODO: add scale line -->

        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import { MapPoint } from '../store/index';
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

    get scale(): { label: string; width: string } {
        const factor = 70;

        // distance in meters
        const distance = this.resolution * factor;

        // length of the distance number
        const len = Math.round(distance).toString().length;
        const div = Math.pow(10, len - 1);

        // rounded distance
        const num = Math.ceil(distance / div) * div;

        // length of the scale line
        const pixels = num / this.resolution;

        return { width: `${pixels}px`, label: `${num / 1000}km` };
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

    .cip-separator {
        flex: 1;
    }

    .cip-scale {
        margin-right: 1.5rem;

        .cip-scale-line {
            display: inline-block;
            border-top: $border-colour-one 2px solid;
        }
    }

    @media (max-width: 991px) {
        background: white;
    }
}
</style>
