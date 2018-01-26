<template>
    <div id="map-anchor"></div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import sprintf from 'sprintf-js';

import { rGetCurrentVariable } from '../store/modules/app/index';

@Component
export default class MapTable extends Vue {
    get anchor(): HTMLElement {
        return document.getElementById('map-anchor')!;
    }

    get currentVariable(): string {
        return rGetCurrentVariable(this.$store);
    }

    mounted(): void {
        let RZ = (<any>window).RZ;

        if (!RZ) {
            // TODO: if we implementing JIT RAMP loading, it should happen here
            return;
        }

        if (this.currentVariable === '') {
            return;
        }

        new RZ.Map(
            this.anchor,
            `./static/configs/config-${this.currentVariable.replace(
                /_/g,
                '-'
            )}.en-CA.json`
        );

        let tooltip;
        RZ.mapAdded.subscribe(() => {
            RZ.mapInstances[
                RZ.mapInstances.length - 1
            ].ui.tooltip.mouseOver.subscribe((z: any) => {
                z.event.preventDefault();
                z.attribs.then((a: any) => {
                    let name = a.station_name_nom;
                    let value = a.Annual_Annuel;
                    let currentTemplate = `<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend Value: %(value)s</span></div>`;
                    let tooltip = z.add(
                        sprintf.sprintf(currentTemplate, { name, value })
                    );
                });
            });
        });
    }
}
</script>

<style lang="scss" scoped>

</style>
