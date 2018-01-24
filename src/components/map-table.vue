<template>
    <details>
        <summary>View map data</summary>
            <div class="summary">
                <table id="map-table" class="wb-tables table table-striped" data-wb-tables='{ "scrollX": true }' v-if="config">
                    <thead>
                        <tr>
                            <th v-for="col in config.columns" :key="col.name">{{col.name}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(feature, index) in config.data" :key="`${index}-feature`">
                            <td v-for="(col,index) in config.columns" :key="`${index}-data`">{{feature[col.dataKey] || '-'}}</td>
                        </tr>
                    </tbody>
                </table>
            </div> 
    </details>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

@Component
export default class MapTable extends Vue {
    @Prop() config: any;
}
</script>

