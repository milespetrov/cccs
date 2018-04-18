<template>
    <aside class="cip-map-view">

        <!-- <map-instance :key="`instance-${reloadKey}`"></map-instance> -->

        <map-table :key="`instance-${reloadKey}`"></map-table>

        <br>
        <p>{{ $t(`map.${datasetId}_desc`) }}</p>

       <!--  <rv-map class="myMap" id="mobile-map" is="rv-map"
            rv-config="http://fgpv.cloudapp.net/demo/develop/dev/samples/config/config-sample-01-structured-visibility-sets.json"
            rv-langs='["en-CA", "fr-CA"]'></rv-map> -->
    </aside>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State } from 'vuex-class';

import MapTable from './map-table.vue';
import MapInstance from './map-instance.vue';

@Component({
    components: {
        'map-instance': MapInstance,
        'map-table': MapTable
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
#map-anchor {
    height: 500px;
}
</style>
