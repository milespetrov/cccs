import chartView from './components/chart-view.vue';
import chartViewControls from './components/chart-view-controls.vue';
import mapView from './components/map-view.vue';
import mapViewControls from './components/map-view-controls.vue';

import { Route, RouteConfig } from 'vue-router';
import { ViewType } from '@/types';

const routes: RouteConfig[] = [
    {
        path: '/chart',
        components: {
            visualization: chartView,
            'view-controls': chartViewControls
        },
        name: ViewType.ChartView
    },
    {
        path: '/map',
        components: {
            visualization: mapView,
            'view-controls': mapViewControls
        },
        name: ViewType.MapView
    }
];

export default routes;
