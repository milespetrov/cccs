<template>
    
    <a :lang="targetLocale" :href="targetUrl" v-if="targetUrl !== ''">{{ $t('lang.toggle') }}</a> 

</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

import page from './page-values';
import { mixins } from 'vue-class-component';
import { StoreDataMixin } from './globals/mixin';
import { Route } from 'vue-router/types/router';

const pageName = {
    en: 'climate-maps.html',
    fr: 'cartes-climatiques.html'
};

@Component
export default class LanguageToggle extends mixins(StoreDataMixin) {
    /**
     * A target url for switching language but preserving the current state.
     */
    targetUrl: string = '';

    /**
     * Watch the $route changes and construct a new targetUrl for language switching after every change.
     */
    @Watch('$route')
    onRouteChange() {
        this.updateTargetUrl();
    }

    /**
     * Watch for the languageToggleDomain value to change (be loaded from the `app-config.json` file).
     */
    @Watch('languageToggleDomain')
    onLanguageToggleDomainChange() {
        this.updateTargetUrl();
    }

    /**
     * Get the target locale value for switching language.
     */
    get targetLocale(): string {
        return this.$i18n.locale === 'en' ? 'fr' : 'en';
    }

    /**
     * Construct the target url for language as
     */
    updateTargetUrl(): void {
        // if the `languageToggleDomain` is `null`, the `app-config` hasn't loaded yet;
        // `languageToggleDomain` is set to '' in the dev environemnt (think localhost)
        if (this.languageToggleDomain === null) {
            return;
        }
        
        // if the toggle domain is not provided, just flip the name of the page keeping the current domain name
        if (this.languageToggleDomain === '') {
            this.targetUrl = window.location.href.replace(pageName[this.$i18n.locale], pageName[this.targetLocale]);
        } else {
            this.targetUrl = `${this.languageToggleDomain}/${pageName[this.targetLocale]}${window.location.hash}`;
        }
    }
}
</script>
