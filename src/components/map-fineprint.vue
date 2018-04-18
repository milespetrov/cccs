<template>
    <div class="cip-map-fineprint-container">
        <!-- WET's `container` class set the width of the div according to the current layout -->
        <div class="cip-map-fineprint-content container">

            <span class="cip-attribution">{{ $t('geo.attribution') }}</span>

            <span class="cip-separator"></span>

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

    tPath: string = 'geo.coordinates';

    /**
     * Convert lat/long in decimal degree to degree, minute, second.
     * Uses the 'formatLatLong' utils function
     */
    get cursorPointDMS(): { x: string; y: string } {
        const { y: lat, x: long } = this.cursorPoint;
        return formatLatLong(long, lat);
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

    .cip-map-fineprint-content {
        display: flex;

        padding: 2px 0;
    }

    .cip-separator {
        flex: 1;
    }
}
</style>
