import Vue from 'vue';
import VueRouter from 'vue-router';

import app from './app.vue';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({ routes });

Vue.config.ignoredElements = ['dv-section', 'dv-chart', 'dv-chart-table'];

new Vue({
    el: '#app',
    router,
    template: '<app/>',
    components: { app }
});

// router.push('chart');
