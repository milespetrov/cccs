<template>

    <div class="cip-pan-guard" ref="panGuard">
        <p class="cip-label">{{ $t('geo.panguard') }}</p>
    </div>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import { MapPoint } from '../store/index';
import { formatLatLong } from '@/globals/utils';

@Component
export default class MapPanguard extends Vue {
    @Prop() _mapi: any;
    mapElem: HTMLElement;
    msgShown: boolean = false;
    panGuardClassList: DOMTokenList;

    mounted(): void {
        this.mapElem = this._mapi.mapDiv[0].querySelector('.rv-esri-map')!;
        this.panGuardClassList = this.$el.classList;

        this.mapElem.addEventListener('touchstart', this.ontouchstartHandler, {
            capture: true
        });

        this.mapElem.addEventListener('touchmove', this.ontouchstartHandler, {
            capture: true
        });

        this.mapElem.addEventListener('touchend', this.ontouchendHandler, {
            capture: true
        });

        this._mapi.mapDiv[0].querySelector('svg[style*="touch-action: none"]').style.touchAction = '';
    }

    ontouchendHandler(event: TouchEvent): void {
        this._mapi._fgpMap._map.enableMapNavigation();
        this.panGuardClassList.remove('cip-active');
        this.panGuardClassList.remove('cip-hidden-scroll');
    }

    ontouchstartHandler(event: TouchEvent): void {
        const panGuardClassList = this.$el.classList;

        if (event.touches.length === 1 && !this.msgShown) {
            this.msgShown = true;
            panGuardClassList.add('cip-active');

            window.setTimeout(() => {
                panGuardClassList.remove('cip-active');
                panGuardClassList.add('cip-paning');
            }, 2000);
        } else if (event.touches.length === 2) {
            this._mapi._fgpMap._map.disableMapNavigation();
            event.stopPropagation();
            panGuardClassList.add('cip-active');
            panGuardClassList.add('cip-hidden-scroll');
        }
    }
}
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';

.cip-pan-guard {
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

    &.cip-hidden-scroll {
        opacity: 0;
    }

    &.cip-paning {
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
