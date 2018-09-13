<template>
    
    <a :lang="targetLocale" :href="targetUrl">{{ $t('lang.toggle') }}</a> 

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import page from './page-values';
import { mixins } from 'vue-class-component';
import { BreadCrumbEntity } from '@/types';
import { StoreDataMixin } from './globals/mixin';

const pageName = {
    en: 'climate-maps.html',
    fr: 'cartes-climatiques.html'
};

@Component
export default class LanguageToggle extends mixins(StoreDataMixin) {
    /**
     * Get the target locale value for switching language.
     */
    get targetLocale(): string {
        return this.$i18n.locale === 'en' ? 'fr' : 'en';
    }

    /**
     * Construct a url for switching language.
     */
    get targetUrl(): string {
        // if the toggle domain is not provided, just flip the name of the page keeping the current domain name
        if (this.languageToggleDomain === '') {
            return window.location.href.replace(pageName[this.$i18n.locale], pageName[this.targetLocale]);
        } else {
            return `${this.languageToggleDomain}/${pageName[this.targetLocale]}${window.location.hash}`;
        }
    }
}
</script>
