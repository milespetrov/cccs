import chartView from './components/chart-view.vue';
import chartViewControls from './components/chart-view-controls.vue';
import mapView from './components/map-view.vue';
import mapViewControls from './components/map-view-controls.vue';

import { Route, RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
    {
        path: '/chart',
        components: {
            visualization: chartView,
            'view-controls': chartViewControls
        },
        name: 'chart-view'
    },
    {
        path: '/map',
        components: {
            visualization: mapView,
            'view-controls': mapViewControls
        },
        name: 'map-view'
    }
];

export default routes;
