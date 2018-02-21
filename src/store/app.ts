import { ActionContext, Store, StoreOptions, Module } from 'vuex';

import { AppState, CenterPoint } from './index';

import controls from './../globals/controls';

type AppContext = ActionContext<AppState, AppState>;

const state: AppState = {
    currentView: null,
    timePeriodId: null,
    variableId: null,
    datasetId: null,
    stationId: null,
    rcpId: null,
    centerPoint: null,
    zoomLevel: null,

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
            s: state.stationId,
            r: state.rcpId,
            c: state.centerPoint ? state.centerPoint.safeString : null,
            z: state.zoomLevel
        };

        // remove null values from the query object
        Object.keys(queryObject).forEach(
            key => queryObject[key] == null && delete queryObject[key]
        );

        return queryObject;
    },

    getControls: () => {
        return controls.config[state.datasetId!][state.currentView!];
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

    setStationId(context: AppContext, value: string | null) {
        context.commit('SET_STATION_ID', value);
    },

    setRcpId(context: AppContext, value: string | null) {
        context.commit('SET_RCP_ID', value);
    },

    setCenterPoint(
        context: AppContext,
        value: { x: number; y: number } | string | null
    ): void {
        let point;

        if (value === null || typeof value == 'undefined') {
            point = null;
        } else if (typeof value !== 'string') {
            point = new CenterPoint(value.x, value.y);
        } else {
            let [x, y] = value.split(',');
            point = new CenterPoint(parseFloat(x), parseFloat(y));
        }

        context.commit('SET_CENTER_POINT', point);
    },

    setZoomLevel(context: AppContext, value: string | null) {
        context.commit('SET_ZOOM_LEVEL', value);
    },

    setMapPin(
        context: AppContext,
        value: { x: number; y: number } | string | null
    ): void {
        let point;

        if (value === null || typeof value == 'undefined') {
            point = null;
        } else if (typeof value !== 'string') {
            point = new CenterPoint(value.x, value.y);
        } else {
            let [x, y] = value.split(',');
            point = new CenterPoint(parseFloat(x), parseFloat(y));
        }

        context.commit('SET_MAP_PIN', value);
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

    SET_STATION_ID(state: AppState, value: string): void {
        state.stationId = value;
    },

    SET_RCP_ID(state: AppState, value: string): void {
        state.rcpId = value;
    },

    SET_CENTER_POINT(state: AppState, value: CenterPoint | null): void {
        state.centerPoint = value;
    },

    SET_ZOOM_LEVEL(state: AppState, value: string | null): void {
        state.zoomLevel = value;
    },

    SET_MAP_PIN(state: AppState, value: CenterPoint): void {
        state.mapPin = value;
    }
};

export const app: StoreOptions<AppState> = {
    state,
    getters,
    actions,
    mutations
};
