<template>
    <div class="cip-map-view">
        
        <div class="cip-strip cip-backdrop-map">
            <map-instance :key="`instance-${reloadKey}`"></map-instance>
        </div>

        <aside class="cip-map-view mrgn-tp-md">
            <map-table :key="`instance-${reloadKey}`"></map-table>

            <br>
            <p>{{ $t(`map.${datasetId}_desc`) }}</p>
        </aside>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State } from 'vuex-class';

import MapTable from './map-table.vue';
import MapInstance from './map-instance.vue';

@Component({
    components: {
        MapInstance,
        MapTable
    }
})
export default class MapView extends Vue {
    @State datasetId: string;

    /**
     * The table component will be force-reloaded on the `reloadKey` change.
     */
    reloadKey: string = '';

    @Watch('datasetId')
    onDatasetChange() {
        this.reloadKey = this.datasetId;
    }
}
</script>


<style lang="scss" scoped>
img {
    width: 100%;
}
/* 
#map-anchor {
    height: 500px;
} */

.cip-map-view {
    // margin-top: 35px;
}
</style>
