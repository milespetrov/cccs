<template>
    <div class="visualization-menu container">

        <span class="separator"></span>

        <div class="menu-option">
            <button @click="changeView('chart-view')">chart</button>
        </div>

        <div class="menu-option">
            <b-dropdown text="Download" variant="light" class="m-md-2" right>
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

import api from './../api/main';

@Component
export default class MapViewControls extends Vue {
    downloadImage(type: string): void {
        // TODO: trigger ramp export map image through API
    }

    changeView(viewName: string): void {
        this.$router.push({
            name: viewName,
            query: { t: this.$router.currentRoute.query.t, v: 'temperature' }
        });
    }
}
</script>

<style lang="scss" scoped>
.visualization-menu {
    height: 3rem * 1.6;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 1rem;
    padding-left: 0;
    background-color: lightgray;

    .separator {
        flex: 1;
    }

    .menu-option {
        margin: 0 2rem;
        // font-weight: bold;

        > svg {
            margin: auto;
        }
    }
}

.b-dropdown {
    .dropdown-item-mutli {
        display: flex;
        align-items: center;
        padding: 0.25rem 1.5rem;

        span {
            flex: 1 0 auto;
            white-space: nowrap;
            margin-right: 4rem;
        }

        &-options {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            width: 14rem;

            .dropdown-item {
                // flex-basis: 50%;
                width: 50%;
                text-align: center;

                &:only-child {
                    width: 100%;
                }
            }
        }
    }
}
</style>
