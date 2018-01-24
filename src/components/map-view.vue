<template>
    <aside class="root">
        <div id="map-anchor"></div>
        <details>
            <summary>View map data</summary>
            <div class="summary">
                <table id="map-table" class="wb-tables table table-striped" data-wb-tables='{ "scrollX": true }' :config="config">
                    <thead>
                        <tr>
                            <th v-for="col in config.columns" :key="col.name">{{col.name}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(feature, index) in config.data" :key="`${index}-feature`">
                            <td v-for="(col,index) in config.columns" :key="`${index}-data`">{{feature[col.data] || '-'}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </details>
    </aside>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { sprintf } from 'sprintf-js';

import api from './../api/main';

@Component
export default class MapView extends Vue {
    data: any;
    config:any = {};

    async mounted(): Promise<void> {
        if (!this.data) {
            this.data = await $.getJSON('http://cipgis.canadaeast.cloudapp.azure.com/arcgis/rest/services/AHCCD_Denorm/MapServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&f=json', (data) => {return data});

            this.updateTable(this.data);
        }
    }

    updateTable(data:any): void {
        const columns: object[] = [];
        let tableData: string[];

        Object.keys(data.features[0].attributes).forEach(column => {
           columns.push({
               name: column,
               data: column
           });
        });

        tableData = (<object[]>data.features).map(feature => {
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
