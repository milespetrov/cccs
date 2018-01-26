<template>
    <aside class="root">

        <!-- <div id="map-anchor"></div> -->

        <map-instance :key="currentVariable"></map-instance>

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
import MapInstance from './map-instance.vue';
import sprintf from 'sprintf-js';

interface tooltips {
    'en-CA': { [key: string]: { [key: string]: string } };
    'fr-CA': { [key: string]: { [key: string]: string } };
    [key: string]: { [key: string]: { [key: string]: string } };
}

@Component({
    components: {
        'map-instance': MapInstance,
        'map-table': MapTable
    }
})
export default class MapView extends Vue {
    updates: number = 0;
    config: any = {};

    tooltipTemplates: tooltips = {
        'en-CA': {
            ahccd: {
                'Mean Temperature':
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                'Minimum Temperature':
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                'Maximum Temperature':
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                Precipitation:
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>"
            }
        },
        'fr-CA': {
            ahccd: {
                'Mean Temperature':
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                'Minimum Temperature':
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                'Maximum Temperature':
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                Precipitation:
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>"
            }
        }
    };

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

        let RZ = (<any>window).RZ;
        // TODO: link to a language choice; property, or stored value, or button
        let lang = 'en-CA';
        // TODO: link once dataSet selector is finalized
        let dataSet = 'ahccd';

        if (!RZ) {
            return;
        }

        new RZ.Map(
            document.getElementById('map-anchor'),
            './static/configs/config-ahccd-mean.en-CA.json'
        );

        let tooltip;
        RZ.mapAdded.subscribe(() => {
            RZ.mapInstances[
                RZ.mapInstances.length - 1
            ].ui.tooltip.mouseOver.subscribe((z: any) => {
                z.event.preventDefault();
                z.attribs.then((a: any) => {
                    const name = a.station_name_nom;
                    const value = Intl.NumberFormat(lang).format(
                        a.Annual_Annuel
                    );
                    const currentTemplate = this.tooltipTemplates[lang][
                        dataSet
                    ][this.currentVariable];
                    tooltip = z.add(
                        sprintf.sprintf(currentTemplate, <any>{ name, value })
                    );
                });
            });
        });
    }

    get currentVariable() {
        return rGetCurrentVariable(this.$store);
    }

    @Watch('currentVariable')
    async onVariableChange() {
        const tempData: any = await $.getJSON(
            'http://cipgis.canadaeast.cloudapp.azure.com/arcgis/rest/services/AHCCD_Denorm/MapServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&f=json',
            data => {
                return data;
            }
        );
        const columns: object[] = [];
        let tableData: string[];

        Object.keys(tempData.features[0].attributes).forEach(column => {
            columns.push({
                // the name to display
                name: column,
                // the key to access the data in the feature
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
