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

    mounted(): void {
        this.mapElem = this._mapi.mapDiv[0].querySelector('.rv-esri-map')!;

        this.mapElem.addEventListener('touchmove', this.ontouchmoveHandler, {
            capture: true
        });

        this.mapElem.addEventListener('touchend', (event: TouchEvent) => {
            this._mapi._fgpMap._map.enableMapNavigation();
        });

        this._mapi.mapDiv[0].querySelector('svg[style*="touch-action: none"]').style.touchAction = '';
    }

    ontouchmoveHandler(event: TouchEvent): void {
        const panGuardClassList = this.$el.classList;
        if (event.touches.length === 1 && !this.msgShown) {
            event.stopPropagation();
            this.msgShown = true;

            panGuardClassList.remove('cip-paning');
            panGuardClassList.add('cip-active');
            window.setTimeout(() => {
                panGuardClassList.remove('cip-active');
                panGuardClassList.add('cip-paning');
            }, 2000);
        } else if (event.touches.length === 2) {
            panGuardClassList.add('cip-paning');
            panGuardClassList.remove('cip-active');
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
