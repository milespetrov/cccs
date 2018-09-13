<template>
    <nav role="navigation" id="wb-bc" property="breadcrumb">
        <h2>You are here:</h2>
        <div class="container">
            <div class="row">
                <ol class="breadcrumb">
                    <li v-for="bc in breadCrumbUrls" :key="bc.name">
                        <a :href="bc.url">{{ bc.name }}</a>
                    </li>
                </ol>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import page from './page-values';
import { BreadCrumbEntity } from '@/types';

const StateData = namespace('data', State);

@Component
export default class BreadCrumbs extends Vue {
    @StateData breadCrumbUrls: BreadCrumbEntity[];
}
</script>
