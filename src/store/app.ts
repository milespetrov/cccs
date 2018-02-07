import { ActionContext, Store, StoreOptions, Module } from 'vuex';

import { AppState, CenterPoint } from './index';

type AppContext = ActionContext<AppState, AppState>;

const state: AppState = {
    isVariableSelectorOpen: true,

    timePeriodId: null,
    variableId: null,
    datasetId: null,
    stationId: null,
    centerPoint: null
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
            c: state.centerPoint ? state.centerPoint.safeString : null
        };

        // remove null values from the query object
        Object.keys(queryObject).forEach(
            key => queryObject[key] == null && delete queryObject[key]
        );

        return queryObject;
    }
};

// actions
const actions = {
    toggleVariableSelector(context: AppContext, value: boolean) {
        context.commit('TOGGLE_VARIABLE_SELECTOR', value);
    },

    setTimePeriodId(context: AppContext, value: string) {
        context.commit('SET_TIME_PERIOD_ID', value);
    },

    setVariableId(context: AppContext, value: string) {
        context.commit('SET_VARIABLE_ID', value);
    },

    setDatasetId(context: AppContext, value: string) {
        context.commit('SET_DATASET_ID', value);
    },

    setStationId(context: AppContext, value: string) {
        context.commit('SET_STATION_ID', value);
    },

    setCenterPoint(
        context: AppContext,
        value: { x: number; y: number } | string | null
    ) {
        let point;

        if (value === null) {
            point = null;
        } else if (typeof value !== 'string') {
            point = new CenterPoint(value.x, value.y);
        } else {
            let [x, y] = value.split.apply(',');
            point = new CenterPoint(parseFloat(x), parseFloat(y));
        }

        context.commit('SET_CENTER_POINT', point);
    }
};

// mutations
const mutations = {
    TOGGLE_VARIABLE_SELECTOR(state: AppState, value: boolean): void {
        state.isVariableSelectorOpen = value;
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

    SET_CENTER_POINT(state: AppState, value: CenterPoint | null): void {
        state.centerPoint = value;
    }
};

export const app: StoreOptions<AppState> = {
    state,
    getters,
    actions,
    mutations
};
