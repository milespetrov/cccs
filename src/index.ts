import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex, { Store } from 'vuex';
import VueI18n from 'vue-i18n';

import app from './app.vue';
import routes from './routes';
import { AppState, createStore } from './store';
import api from './api/main';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueI18n);

const router = new VueRouter({ routes });

// initialize a new app-wide store
const store: Store<AppState> = createStore();

Vue.config.ignoredElements = [
    'dv-section',
    'dv-chart',
    'dv-chart-table',
    'rv-map'
];

// TODO: move this to a separate module
// TODO: check query string or url to to load the proper locale
// TODO: hide unstyled content until the locale messages are loaded
// #region localization support

const i18n = new VueI18n({
    locale: '_', // set locale
    fallbackLocale: 'en'
    // messages // set locale messages
});

const loadedLanguages: string[] = []; // our default language that is prelaoded

function setI18nLanguage(lang: string) {
    i18n.locale = lang;
    /* axios.defaults.headers.common['Accept-Language'] = lang
    document.querySelector('html').setAttribute('lang', lang) */
    return lang;
}

async function loadLanguageAsync(lang: string) {
    if (loadedLanguages.includes(lang)) {
        setI18nLanguage(lang);
        return;
    }

    const messages = await import(/* webpackChunkName: 'i18n/lang-[request]' */ `./lang/${lang}`);
    i18n.setLocaleMessage(lang, messages);
    loadedLanguages.push(lang);
    setI18nLanguage(lang);
}

loadLanguageAsync('en');

// #endregion localization support

const v = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h('app'),
    components: { app }
});

// supresses all DQV logs except errors
api.DQV.loglevel.setLevel(4);
