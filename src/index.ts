import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex, { Store } from 'vuex';

import app from './app.vue';
import { createStore, RootState } from './store';
import { i18n } from './lang';

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter();

// initialize a new app-wide store
const store: Store<RootState> = createStore();

Vue.config.ignoredElements = ['rv-map'];

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h('app'),
    components: { app }
});

// TODO: include icon credits if ended up using them
// https://www.flaticon.com/packs/weather-53
