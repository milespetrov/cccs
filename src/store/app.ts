import { ActionContext, Store, StoreOptions, Module } from 'vuex';

import { AppState, MapPoint, Range } from './index';

import controls from './../globals/controls';

type AppContext = ActionContext<AppState, AppState>;

const state: AppState = {
    currentView: null,
    timePeriodId: null,
    variableId: null,
    datasetId: null,
    featureId: null,
    featurePoint: null,
    rcpId: null,
    centerPoint: null,
    zoomLevel: null,
    chartRange: null,
    chartSeries: null,

    mapPin: null
};

// getters
const getters = {
    // TODO: type the query object
    getQuery: (state: AppState): object => {
        const queryObject: { [name: string]: string | null } = {
            t: state.timePeriodId,
            v: state.variableId,
            d: state.datasetId,
            f: state.featureId,
            fp: state.featurePoint ? state.featurePoint.safeString : null,
            r: state.datasetId !== 'ahccd' ? state.rcpId : null,
            cp: state.centerPoint ? state.centerPoint.safeString : null,
            z: state.zoomLevel,
            cs: state.chartSeries,
            cr: state.chartRange ? state.chartRange.safeString : null
        };

        // remove null values from the query object
        Object.keys(queryObject).forEach(key => queryObject[key] === null && delete queryObject[key]);

        return queryObject;
    },

    getControls: () => {
        return controls.config.default[state.currentView!].concat(
            state.datasetId ? controls.config[state.datasetId!][state.currentView!] : []
        );
    }
};

// actions
const actions = {
    setCurrentView(context: AppContext, value: string) {
        context.commit('SET_CURRENT_VIEW', value);
    },

    setTimePeriodId(context: AppContext, value: string | null) {
        context.commit('SET_TIME_PERIOD_ID', value);
    },

    setVariableId(context: AppContext, value: string | null) {
        context.commit('SET_VARIABLE_ID', value);
    },

    setDatasetId(context: AppContext, value: string | null) {
        context.commit('SET_DATASET_ID', value);
    },

    setFeatureId(context: AppContext, value: string | null) {
        context.commit('SET_FEATURE_ID', value);
    },

    setFeaturePoint(context: AppContext, value: { x: number; y: number } | string | null): void {
        let point;

        if (value === null) {
            point = null;
        } else if (typeof value !== 'string') {
            point = new MapPoint(value.x, value.y);
        } else {
            const [x, y] = value.split(',');
            point = new MapPoint(parseFloat(x), parseFloat(y));
        }

        context.commit('SET_FEATURE_POINT', point);
    },

    setRcpId(context: AppContext, value: string | null) {
        context.commit('SET_RCP_ID', value);
    },

    setCenterPoint(context: AppContext, value: { x: number; y: number } | string | null): void {
        let point;

        if (value === null) {
            point = null;
        } else if (typeof value !== 'string') {
            point = new MapPoint(value.x, value.y);
        } else {
            const [x, y] = value.split(',');
            point = new MapPoint(parseFloat(x), parseFloat(y));
        }

        context.commit('SET_CENTER_POINT', point);
    },

    setZoomLevel(context: AppContext, value: string | null) {
        context.commit('SET_ZOOM_LEVEL', value);
    },

    setMapPin(context: AppContext, value: { x: number; y: number } | string | null): void {
        let point;

        if (value === null) {
            point = null;
        } else if (typeof value !== 'string') {
            point = new MapPoint(value.x, value.y);
        } else {
            const [x, y] = value.split(',');
            point = new MapPoint(parseFloat(x), parseFloat(y));
        }

        context.commit('SET_MAP_PIN', value);
    },

    setChartRange(context: AppContext, value: { min: number; max: number }) {
        console.log(value);
        const newVal = new Range(value.min, value.max);
        context.commit('SET_CHART_RANGE', newVal);
        console.log((<any>state.chartRange).min + '...');
    },

    clearChart(context: AppContext): void {
        context.commit('SET_CHART_RANGE', null);
        context.commit('SET_CHART_SERIES', null);
    },

    clearFeature(context: AppContext): void {
        context.commit('SET_FEATURE_ID', null);
        context.commit('SET_FEATURE_POINT', null);
    }
};

// mutations
const mutations = {
    SET_CURRENT_VIEW(state: AppState, value: string): void {
        state.currentView = value;
    },

    SET_TIME_PERIOD_ID(state: AppState, value: string): void {
        state.timePeriodId = value;
    },

    SET_VARIABLE_ID(state: AppState, value: string): void {
        state.variableId = value;
    },

    SET_DATASET_ID(state: AppState, value: string): void {
        state.datasetId = value;
    },

    SET_FEATURE_ID(state: AppState, value: string): void {
        state.featureId = value;
    },

    SET_FEATURE_POINT(state: AppState, value: MapPoint | null): void {
        state.featurePoint = value;
    },

    SET_RCP_ID(state: AppState, value: string): void {
        state.rcpId = value;
    },

    SET_CENTER_POINT(state: AppState, value: MapPoint | null): void {
        state.centerPoint = value;
    },

    SET_ZOOM_LEVEL(state: AppState, value: string | null): void {
        state.zoomLevel = value;
    },

    SET_MAP_PIN(state: AppState, value: MapPoint): void {
        state.mapPin = value;
    },

    SET_CHART_RANGE(state: AppState, value: Range | null): void {
        state.chartRange = value;
    },

    SET_CHART_SERIES(state: AppState, value: string | null): void {
        state.chartSeries = value;
    }
};

export const app: StoreOptions<AppState> = {
    state,
    getters,
    actions,
    mutations
};
