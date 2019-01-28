<template>
    <nav role="navigation" id="wb-bc" property="breadcrumb">
        <h2>You are here:</h2>
        <div class="container">
            <ol class="breadcrumb">
                <li v-for="bc in breadCrumbUrls" :key="bc.name">
                    <a :href="bc.url">{{ bc.name }}</a>
                </li>
            </ol>
        </div>
    </nav>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import page from './page-values';
import { mixins } from 'vue-class-component';
import { BreadCrumbEntity } from '@/types';
import { StoreDataMixin } from './globals/mixin';

@Component
export default class BreadCrumbs extends mixins(StoreDataMixin) {}
</script>
