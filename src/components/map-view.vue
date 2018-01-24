<template>
    <aside class="root">
        <div id="map-anchor"></div>
        <map-table :key="currentVariable" :config="config"></map-table>
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
