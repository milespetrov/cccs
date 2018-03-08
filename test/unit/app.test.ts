// tslint:disable:no-unused-expression
// ^ TODO? Custom rule?
// Basic imports for testing
import Vue from 'vue';
import { shallow, createLocalVue } from '@vue/test-utils';
import chai, { expect, should } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import Vuex from 'vuex';

// Allows us to spy on functions
chai.use(sinonChai);

// Need to do this to appease vue things
const localVue = createLocalVue();
localVue.use(Vuex);

// Appeasing Vue some more
const $t = () => undefined;

// Import the module we're testing
import app from './../../src/app.vue';

describe('app.vue', () => {
    let $router: any;

    // store mock
    const store = new Vuex.Store({
        getters: {
            currentView: () => '',
            centerPoint: () => '',
            getQuery: () => '',
            currentDataset: () => ''
        }
    });

    beforeEach(() => {
        // reset route
        $router = {
            currentRoute: {
                name: null,
                query: {}
            },

            push: () => undefined,
            afterEach: () => undefined
        };
    });

    it('should be a vue instance', () => {
        const wrapper = shallow(app, {
            store,
            localVue,
            stubs: ['router-link', 'router-view'],
            mocks: {
                $t,
                $router
            }
        });

        expect(wrapper.isVueInstance());
    });

    it('should call changeViewToMap when header map is clicked', () => {
        const changeViewToMap = sinon.spy();
        const tileCoordinates = sinon.spy();
        const wrapper = shallow(app, {
            methods: {
                changeViewToMap,
                tileCoordinates
            },
            store,
            localVue,
            stubs: ['router-link', 'router-view'],
            mocks: {
                $t,
                $router,
                tileCoordinates
            }
        });

        wrapper.find('.cip-page-header').trigger('click');

        expect(changeViewToMap).to.have.been.called;
    });
});

/**
 *
 * ROUTING
 *
 */

describe('app.vue - routing', () => {
    let $router: any;

    // store mock
    const store = new Vuex.Store({
        getters: {
            currentView: () => '',
            centerPoint: () => '',
            getQuery: () => '',
            currentDataset: () => ''
        },
        actions: {
            setCurrentView: () => undefined
        }
    });

    beforeEach(() => {
        // reset route each time
        $router = {
            currentRoute: {
                name: null,
                query: {}
            },

            push: () => undefined,
            afterEach: () => undefined
        };
    });

    it('should set the currentView in the store when given one in the route', () => {
        // set the route name
        $router.currentRoute.name = 'map-view';

        //spy
        const setCurrentView = sinon.spy();

        const wrapper = shallow(app, {
            methods: {
                setCurrentView
            },
            store,
            localVue,
            stubs: ['router-link', 'router-view'],
            mocks: {
                $t,
                $router
            }
        });

        // make sure the app *tries* to set the current view (this isn't a test for the store functions)
        expect(setCurrentView).to.have.been.calledWith('map-view');
    });

    it('should properly call each store function with correct parameter', () => {
        // set the route
        $router.currentRoute.name = 'map-view';
        $router.currentRoute.query = {
            t: 'Annual_Annuel',
            d: 'ahccd',
            v: 'tmean',
            f: 'some_station_id',
            cp: 'centerPoint',
            z: '8'
        };

        // spy on the functions we care about
        const setTimePeriodId = sinon.spy();
        const setVariableId = sinon.spy();
        const setDatasetId = sinon.spy();
        const setFeatureId = sinon.spy();
        const setCenterPoint = sinon.spy();
        const setZoomLevel = sinon.spy();

        const wrapper = shallow(app, {
            methods: {
                setTimePeriodId,
                setDatasetId,
                setFeatureId,
                setCenterPoint,
                setZoomLevel,
                setVariableId
            },
            store,
            localVue,
            stubs: ['router-link', 'router-view'],
            mocks: {
                $t,
                $router
            }
        });

        //check if the map from parameters to functions is correct
        expect(setTimePeriodId).to.have.been.calledWith('Annual_Annuel');
        expect(setVariableId).to.have.been.calledWith('tmean');
        expect(setDatasetId).to.have.been.calledWith('ahccd');
        expect(setFeatureId).to.have.been.calledWith('some_station_id');
        expect(setCenterPoint).to.have.been.calledWith('centerPoint');
        expect(setZoomLevel).to.have.been.calledWith('8');
    });

    it('should only call the store functions it has a query parameter for', () => {
        // set the route
        $router.currentRoute.name = 'map-view';
        $router.currentRoute.query = {
            t: 'Annual_Annuel',
            d: 'ahccd',
            v: 'tmean'
        };

        // spy on the functions we care about
        const setTimePeriodId = sinon.spy();
        const setVariableId = sinon.spy();
        const setDatasetId = sinon.spy();
        const setFeatureId = sinon.spy();

        const wrapper = shallow(app, {
            methods: {
                setTimePeriodId,
                setDatasetId,
                setFeatureId,
                setVariableId
            },
            store,
            localVue,
            stubs: ['router-link', 'router-view'],
            mocks: {
                $t,
                $router
            }
        });

        // these should get called because t, d, and v exist in the query
        expect(setTimePeriodId).to.have.been.called;
        expect(setVariableId).to.have.been.called;
        expect(setDatasetId).to.have.been.called;
        // this should not
        expect(setFeatureId).to.not.have.been.called;
    });
});
