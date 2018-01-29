import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex, { Store } from 'vuex';

import app from './app.vue';
import routes from './routes';
import { createStore } from './store';
import { AppState } from './store';

Vue.use(VueRouter);
Vue.use(Vuex);

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
    template: '<app/>',
    components: { app }
});

/* import { cTimePeriodId, cVariableId, cDatasetId } from './store/modules/app';



router.afterEach((to, from) => {
    cTimePeriodId(store, to.query.t);
    cVariableId(store, to.query.v);
    cDatasetId(store, to.query.d);
});
 */
