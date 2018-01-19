<template>
    <aside class="root">
        <div id="map-anchor" class="container"></div>
    </aside>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import api from './../api/main';
import { EventEmitter } from 'events';
import { ExtendedAPIPlugin } from 'webpack';

@Component
export default class MapView extends Vue {
    async mounted(): Promise<void>{
        let RZ = (<any>window).RZ;
        if (RZ) {
            new RZ.Map(document.getElementById('map-anchor'), '../static/configs/config-ahccd-demo.en-CA.json');
            let tooltip;
            RZ.mapAdded.subscribe( () => {
                RZ.mapInstances[RZ.mapInstances.length - 1].ui.tooltip.mouseOver.subscribe(function (z: any) {
                    z.event.preventDefault();
                    z.attribs.then(function (a: any) {
                        let name = a.station_name_nom;
                        let value = a.Annual_Annuel;
                        let currentTemplate = "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend Value: %(value)s</span></div>";
                        let tooltip = z.add((<any>window).sprintf(currentTemplate, {name, value}));
                    });
                });
            });
        }
    }
}
</script>


<style lang="scss" scoped>
img {
    width: 100%;
}
#map-anchor {
    height:500px;
}
</style>
