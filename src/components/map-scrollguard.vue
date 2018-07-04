<template>

    <div class="cip-scroll-guard" ref="scrollGuard">
        <p class="cip-label">{{ $t('geo.scrollguard') }}</p>
    </div>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import { MapPoint } from '../store/index';
import { formatLatLong } from '@/globals/utils';

@Component
export default class MapScrollguard extends Vue {
    @Prop() _mapi: any;

    mounted(): void {
        // set a mouse-wheel listener to on the map node
        this._mapi.mapDiv[0].querySelector('.rv-esri-map')!.addEventListener('wheel', this.wheelHandler, {
            capture: true
        });
    }

    wheelHandler(event: WheelEvent): void {
        if (!this._mapi) {
            return;
        }

        const scrollGuardClassList = this.$el.classList;

        // prevent scroll unless ctrlKey is depressed
        if (!event.ctrlKey) {
            // this seems to be the only way to cancel wheel scroll in IE
            // it's enough to `stopPropagation` in other browsers, but in IE, the esri listener fires before this one
            // I couldn't find why this is happening, or how to stop it properly
            // using this esri function seems to be the simplest solution
            // TODO: use a proper API endpoint when it's created
            this._mapi._fgpMap._map.disableScrollWheelZoom();

            scrollGuardClassList.remove('cip-scrolling');
            scrollGuardClassList.add('cip-active');

            // proper use of timeout
            // remove scroll guard notification after two seconds
            window.setTimeout(() => scrollGuardClassList.remove('cip-active'), 2000);
        } else {
            scrollGuardClassList.remove('cip-active');
            scrollGuardClassList.add('cip-scrolling');

            this._mapi._fgpMap._map.enableScrollWheelZoom();
        }
    }
}
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';

.cip-scroll-guard {
    transition: opacity ease-in-out;
    background-color: rgba(0, 0, 0, 0.45);
    text-align: center;

    position: absolute;
    padding: 0px;
    margin: 0px;
    border-width: 0px;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;

    transition-duration: 0.8s;

    opacity: 0;
    pointer-events: none !important;

    &.cip-active {
        opacity: 1;
        transition-duration: 0.3s;
    }

    &.cip-scrolling {
        transition-duration: 0.3s;
    }

    .cip-label {
        font-size: 1em * 1.5;
        color: white;
        position: relative;
        margin: 0;
        top: 50% !important;
        transform: translateY(-50%);
    }
}
</style>
