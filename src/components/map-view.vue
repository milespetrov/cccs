<template>
    <aside class="root">
        <div>
            <img src="https://i.imgur.com/kuV4Zdc.png" alt="" srcset="">
        </div>
    </aside>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import api from './../api/main';

@Component
export default class MapView extends Vue {}
</script>


<style lang="scss" scoped>
img {
    width: 100%;
}
</style>
