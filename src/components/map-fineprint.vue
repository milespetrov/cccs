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

@Component
export default class MapFineprint extends Vue {
    // TODO: use proper type for map instance
    @Prop() cursorPoint: MapPoint;

    tPath: string = 'geo.coordinates';

    /**
     * Convert lat/long in decimal degree to degree, minute, second.
     * This is taken from RAMP source.
     */
    get cursorPointDMS(): { x: string; y: string } {
        const { y: lat, x: long } = this.cursorPoint;
        const degreeSymbol = String.fromCharCode(176);

        const dy = Math.floor(Math.abs(lat)) * (lat < 0 ? -1 : 1);
        const my = Math.floor(Math.abs((lat - dy) * 60));
        const sy = Math.round((Math.abs(lat) - Math.abs(dy) - my / 60) * 3600);

        const dx = Math.floor(Math.abs(long)) * (long < 0 ? -1 : 1);
        const mx = Math.floor(Math.abs((long - dx) * 60));
        const sx = Math.round((Math.abs(long) - Math.abs(dx) - mx / 60) * 3600);

        const y = `${Math.abs(dy)}${degreeSymbol} ${padZero(my)}' ${padZero(sy)}"`;
        const x = `${Math.abs(dx)}${degreeSymbol} ${padZero(mx)}' ${padZero(sx)}"`;

        return { x, y };

        /**
         * Pad value with leading 0 to make sure there is always 2 digits if number is below 10.
         *
         * @function padZero
         * @private
         * @param {Number} val value to pad with 0
         * @return {String} string with always 2 characters
         */
        function padZero(val: number) {
            return val >= 10 ? `${val}` : `0${val}`;
        }
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

    font-size: 10px;
    color: #000;

    .cip-map-fineprint-content {
        display: flex;

        padding-bottom: 2px;
    }

    .cip-separator {
        flex: 1;
    }
}
</style>


