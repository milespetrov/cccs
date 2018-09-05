<template>
    <nav role="navigation" id="wb-bc" property="breadcrumb">
        <h2>You are here:</h2>
        <div class="container">
            <div class="row">
                <ol class="breadcrumb">
                    <li v-for="bc in breadcrumbs"  :key="bc.name">
                        <a :href="bc.url">{{ bc.name }}</a>
                    </li>
                </ol>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import page from './page-values';

@Component
export default class BreadCrumbs extends Vue {
    breadcrumbs: { url: string; name: string }[] = [];

    async created(): Promise<void> {
        await $.getJSON('assets/configs/app-config.json', data => {
            this.breadcrumbs = data.climateviewerapp[page.lang].breadcrumbs;
        });
    }
}
</script>
