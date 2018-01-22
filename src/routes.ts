import chartView from './components/chart-view.vue';
import mapView from './components/map-view.vue';

import { Route, RouteConfig } from 'vue-router';

// TODO: fake map in the header of the chart-view
// need to create a proper location map component
const fake_map = {
    template: '<span class="fake-location-search-map"></span>'
};

const routes: RouteConfig[] = [
    {
        path: '/chart',
        components: {
            visualization: chartView,
            locationMap: fake_map
        },
        name: 'chart-view',
        props: {
            visualization: (route: Route) => ({
                variable: route.query.v,
                timePeriod: route.query.t
            })
        }
    },
    {
        path: '/map',
        components: { visualization: mapView },
        name: 'map-view',
        props: {
            visualization: (route: Route) => ({
                variable: route.query.v,
                timePeriod: route.query.t
            })
        }
    }
];

export default routes;
