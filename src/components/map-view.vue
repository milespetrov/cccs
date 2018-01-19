<template>
    <aside class="root">
        <div id="map-anchor"></div>
    </aside>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { sprintf } from 'sprintf-js';

import api from './../api/main';

@Component
export default class MapView extends Vue {
    mounted(): void {
        let RZ = (<any>window).RZ;

        if (!RZ) {
            return;
        }

        console.log('what??');

        new RZ.Map(
            document.getElementById('map-anchor'),
            '../static/configs/config-ahccd-demo.en-CA.json'
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
                        sprintf(currentTemplate, {
                            name,
                            value
                        })
                    );
                });
            });
        });
    }
}
</script>


<style lang="scss" scoped>
img {
    width: 100%;
}
#map-anchor {
    height: 500px;
}
</style>
