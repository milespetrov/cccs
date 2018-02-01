<template>
    <div class="cip-view-controls container">

        <span class="separator"></span>

        <div class="menu-option">
            <button @click="changeView('chart-view')">chart</button>
        </div>

        <div class="menu-option">
            <b-dropdown text="Download" variant="light" right>
                <div class="dropdown-item-mutli">
                    <span>Export Map Image</span>

                    <div class="dropdown-item-mutli-options">
                        <b-dropdown-item-button @click="downloadImage('png', true)">.png</b-dropdown-item-button>
                    </div>
                </div>

                <b-dropdown-divider></b-dropdown-divider>

                <b-dropdown-item>Access full dataset in Catalogue</b-dropdown-item>
            </b-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { sprintf } from 'sprintf-js';
import { Getter } from 'vuex-class';

import api from './../api/main';
import { Dictionary } from 'vue-router/types/router';

@Component
export default class MapViewControls extends Vue {
    @Getter getQuery: Dictionary<string>;

    downloadImage(type: string): void {
        // TODO: trigger ramp export map image through API
    }

    changeView(viewName: string): void {
        this.$router.push({
            name: viewName,
            query: this.getQuery
        });
    }
}
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';
@import './../styles/view-controls.scss';
</style>
