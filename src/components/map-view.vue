<template>
    <aside class="root">

        <!-- <map-instance :key="`instance-${reloadKey}`"></map-instance> -->

        <map-table :key="`table-${reloadKey}`" :config="config"></map-table>

       <!--  <rv-map class="myMap" id="mobile-map" is="rv-map"
            rv-config="http://fgpv.cloudapp.net/demo/develop/dev/samples/config/config-sample-01-structured-visibility-sets.json"
            rv-langs='["en-CA", "fr-CA"]'></rv-map> -->
    </aside>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State } from 'vuex-class';

import api from './../api/main';
import MapTable from './map-table.vue';
import MapInstance from './map-instance.vue';
import sprintf from 'sprintf-js';
import { log } from 'util';

@Component({
    components: {
        'map-instance': MapInstance,
        'map-table': MapTable
    }
})
export default class MapView extends Vue {
    config: any = {};

    aliases: object = {
        station_name_nom: 'Station Name',
        stnid: 'Station ID',
        beg_yr_annee_dev: 'Beginning Year',
        beg_mon_mois_deb: 'Beginning Month',
        end_yr_annee_fin: 'Ending Year',
        end_mon_mois_fin: 'Ending Month',
        Annual_Annuel: 'Annual'
    };

    /**
     * The map and table components will be force-reloaded on the `reloadKey` change.
     */
    reloadKey: string = '';

    /**
     * Keeps track of the internal state of the view. When `false`, no update should be initiated inside the component.
     */

    isActive: boolean = false;

    /**
     * `Activated` lifecycle hook.
     * https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
     */
    activated(): void {
        this.isActive = true;

        // trigger data update change
        this.onVariableChange();
    }

    /**
     * `Activated` lifecycle hook.
     * https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
     */
    deactivated(): void {
        console.log('activated', false);

        this.isActive = false;
    }

    mounted(): void {
        this.onVariableChange();
    }

    @State('variableId') currentVariable: string;

    @Watch('currentVariable')
    async onVariableChange() {
        // do not process any data updates when deactivated
        if (!this.isActive) {
            return;
        }

        // HACK: map is force-reloaded for the momement until its API supports adding/removing layers
        // update the reload keys to force-reload the map and table components
        this.reloadKey = this.currentVariable;

        const varArray: any = {
            precip: 3,
            tmean: 0,
            tmax: 2,
            tmin: 1
        }

        const tempData: any = await $.getJSON(
            `http://cipgis.canadaeast.cloudapp.azure.com/arcgis/rest/services/AHCCD/AHCCD_en/MapServer/${varArray[this.currentVariable]}/query?where=1%3D1&outFields=*&returnGeometry=false&f=json`,
            data => {
                return data;
            }
        );
        const columns: object[] = [];
        let tableData: string[];

        Object.keys(tempData.features[0].attributes).forEach(column => {
            if (column in this.aliases) {
                columns.push({
                    // the name to display
                    name: (<any>this.aliases)[column],
                    // the key to access the data in the feature
                    dataKey: column
                });
            }
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
