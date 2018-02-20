import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex, { Store } from 'vuex';
import VueI18n from 'vue-i18n';

import app from './app.vue';
import routes from './routes';
import { createStore } from './store';
import { AppState } from './store';
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

const v = new Vue({
    el: '#app',
    router,
    store,
    render: h => h('app'),
    components: { app }
});

// supresses all DQV logs except errors
api.DQV.loglevel.setLevel(4);
