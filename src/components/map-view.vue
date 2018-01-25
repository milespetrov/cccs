<template>
    <aside class="root">
        <div id="map-anchor"></div>
        <map-table :key="currentVariable" :config="config"></map-table>

       <!--  <rv-map class="myMap" id="mobile-map" is="rv-map"
            rv-config="http://fgpv.cloudapp.net/demo/develop/dev/samples/config/config-sample-01-structured-visibility-sets.json"
            rv-langs='["en-CA", "fr-CA"]'></rv-map> -->
    </aside>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import api from './../api/main';
import { rGetCurrentVariable } from '../store/modules/app/index';
import MapTable from './map-table.vue';

@Component({
    components: {
        'map-table': MapTable
    }
})
export default class MapView extends Vue {
    updates:number = 0;
    config:any = {};

    mounted(): void {
        this.onVariableChange();
        /* const stopHandle = window.setInterval(() => {
            if (!(<any>window).jQuery) {
                console.log('waiting for jquery');
            } else {
                console.log('jquery', (<any>window).jQuery);

                window.clearInterval(stopHandle);

                $.getScript('http://fgpv.cloudapp.net/demo/v3/dev/rv-main.js');
            }
        }, 100); */

        // TODO: map disabled until the jquery collisions are fixed
        let RZ = (<any>window).RZ;

        if (!RZ) {
            return;
        }

        console.log('what??');

        new RZ.Map(
            document.getElementById('map-anchor'),
            'http://fgpv.cloudapp.net/demo/develop/dev/samples/config/config-sample-01-structured-visibility-sets.json'
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

    get currentVariable(){
        return rGetCurrentVariable(this.$store);
    }

    @Watch("currentVariable")
    async onVariableChange() {
        console.log('CHANGED');
        let tempData: any = await $.getJSON('http://cipgis.canadaeast.cloudapp.azure.com/arcgis/rest/services/AHCCD_Denorm/MapServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&f=json', (data) => {return data});
        const columns: object[] = [];
        let tableData: string[];

        Object.keys(tempData.features[0].attributes).forEach(column => {
           columns.push({
               name: column,
               dataKey: column
           });
        });

        tableData = (<object[]>tempData.features).map(feature => {
            
            return (<any>feature).attributes;
        });

        this.config = {
            data: tableData,
            columns: columns
        };
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
