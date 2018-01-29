<template>
    <aside class="root">

        <map-instance :key="`instance-${currentVariable}`"></map-instance>

        <map-table :key="`table-${currentVariable}`" :config="config"></map-table>

       <!--  <rv-map class="myMap" id="mobile-map" is="rv-map"
            rv-config="http://fgpv.cloudapp.net/demo/develop/dev/samples/config/config-sample-01-structured-visibility-sets.json"
            rv-langs='["en-CA", "fr-CA"]'></rv-map> -->
    </aside>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import api from './../api/main';
import { rVariableId } from '../store/modules/app/index';
import MapTable from './map-table.vue';
import MapInstance from './map-instance.vue';
import sprintf from 'sprintf-js';

@Component({
    components: {
        'map-instance': MapInstance,
        'map-table': MapTable
    }
})
export default class MapView extends Vue {
    config: any = {};

    mounted(): void {
        this.onVariableChange();
    }

    get currentVariable() {
        return rVariableId(this.$store);
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
