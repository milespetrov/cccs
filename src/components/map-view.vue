<template>
    <div class="cip-map-view">

        <div class="cip-strip cip-backdrop-map">
            <map-instance :key="`instance-${reloadKey}`"></map-instance>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State } from 'vuex-class';

import MapInstance from './map-instance.vue';

@Component({
    components: {
        MapInstance
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
@import './../styles/variables.scss';
.cip-map-view {
    border-bottom: 3px solid $border-colour-two;
}
</style>
