<template>
    <aside class="root">
        <section class="variables">
            <h3 class="header">
                <i class="fas fa-bars fa-lg"></i>
                <span>Variables</span>
            </h3>
            
            <ul>
                <li>Temparature</li>
                <li>Percipitation</li>
            </ul>
        </section>
        <section class="datasets">
            <h3 class="header">
                <i class="fas fa-bars fa-lg"></i>
                <span>Datasets</span>
            </h3>
            
            <ul>
                <li>AHCDD</li>
            </ul>
        </section>
    </aside>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import api from './../api/main';

@Component
export default class VariableSelector extends Vue {}
</script>

<style lang="scss" scoped>
.root {
    position: relative;
}

.header {
    border: 1px solid #ddd;
    font-size: 1.1em;
    height: 3rem * 1.6;
    margin: auto;
    display: flex;
    align-items: center;

    .fa-bars {
        margin-right: 1rem * 1.6;
    }
}

.variables,
.datasets {
    height: 100%;

    ul {
    }
}

.variables {
}

.datasets {
    display: none;

    position: absolute;
    top: 0;
    right: -100%;
    width: 100%;
    background-color: white;
    z-index: 10;
}
</style>


