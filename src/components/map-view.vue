<template>
    <aside class="root">
        <div id="map-anchor" class="container"></div>
    </aside>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import api from './../api/main';

@Component
export default class MapView extends Vue {
    async mounted(): Promise<void>{
        if ((<any>window).RZ) {
            new (<any>window).RZ.Map(document.getElementById('map-anchor'), '../static/configs/config-ahccd-demo.en-CA.json');
        }
    }
}
</script>


<style lang="scss" scoped>
img {
    width: 100%;
}
#map-anchor {
    height:500px;
}
</style>
