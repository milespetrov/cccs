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
// https://www.flaticon.com/free-icon/pressure_213976#term=air%20pressure%20weather&page=1&position=3
// https://www.flaticon.com/free-icon/toronto_185286
// https://www.flaticon.com/free-icon/map_854878
// https://www.flaticon.com/free-icon/canada_330442#term=canada&page=1&position=8
// https://visualpharm.com/free-icons/last%2024%20hours-595b40b75ba036ed117d853a
