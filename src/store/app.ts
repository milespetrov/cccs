import { ActionContext, Store, StoreOptions, Module } from 'vuex';

import { AppState, MapPoint, Range, ViewType } from './index';

import controls from './../globals/controls';

import {
    defaultSelectors,
    datasets,
    VisualizationControlType,
    DatasetSource,
    DatasetViewSource,
    DatasetId
} from './../configs';

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
    mapPin: null,

    // Does not belong
    internalRouteUpdate: false
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
            r: state.rcpId,
            cp: state.centerPoint ? state.centerPoint.safeString : null,
            z: state.zoomLevel,
            cs: state.chartSeries,
            cr: state.chartRange ? state.chartRange.safeString : null
        };

        // remove null values from the query object
        Object.keys(queryObject).forEach(key => queryObject[key] === null && delete queryObject[key]);

        return queryObject;
    },

    /**
     * Returns a list of VisualizationControlType string specifying which controls shoudl be visible in the current view.
     *
     * @param {AppState} state
     * @returns {VisualizationControlType[]}
     */
    getControls: (state: AppState): VisualizationControlType[] => {
        const options = getters.datasetControlOptions(state);

        // filter out visualization control ids which corresponding configurations are set to be invisible
        const controls = Object.entries(options).reduce<VisualizationControlType[]>((map, [key, value]) => {
            if (value!.visible !== false) {
                map.push(key as VisualizationControlType);
            }
            return map;
        }, []);

        return defaultSelectors.concat(controls);
    },

    datasetControlOptions: (state: AppState): DatasetViewSource => {
        return datasets[state.datasetId!][state.currentView!];
    }
};

// actions
const actions = {
    setCurrentView(context: AppContext, value: ViewType) {
        context.commit('SET_CURRENT_VIEW', value);

        actions.applyDatasetDefault(context);
    },

    setTimePeriodId(context: AppContext, value: string | null) {
        context.commit('SET_TIME_PERIOD_ID', value);
    },

    setVariableId(context: AppContext, value: string | null) {
        context.commit('SET_VARIABLE_ID', value);
    },

    setDatasetId(context: AppContext, value: DatasetId) {
        context.commit('SET_DATASET_ID', value);

        actions.applyDatasetDefault(context);
    },

    /**
     * Apply the default selector values (time perido and rcp model if provided) specified in the current dataset configuration.
     *
     * @param {AppContext} context
     * @returns {void}
     */
    applyDatasetDefault(context: AppContext): void {
        // both dataset and view must be set to apply the dataset defaults
        if (!state.currentView || !state.datasetId) {
            return;
        }

        const datasetControlOptions = getters.datasetControlOptions(context.state);

        // map relevant actions and state accessors agaisnt the visualization control types
        const map: {
            [name: string]: { action: (context: AppContext, value: string | null) => void; state: string | null };
        } = {
            [VisualizationControlType.Time]: {
                action: actions.setTimePeriodId,
                state: state.timePeriodId
            },
            [VisualizationControlType.RCP]: { action: actions.setRcpId, state: state.rcpId }
        };

        [VisualizationControlType.Time, VisualizationControlType.RCP].forEach(type => {
            // if the selector is not defined for this dataset/view combination, reset the value to null
            const selectorSource = datasetControlOptions[type];
            if (!selectorSource) {
                map[type].action(context, null);
                return;
            }

            const currentValue = map[type].state;
            // falsy options specified on the dataset configuration indicate that all available selector options will be used
            // leave the currently selected option in place
            if (currentValue && !selectorSource.options) {
                return;
            }

            // if the currently set value is one of the options specified on the dataset config, leave it in place
            if (currentValue && (<string[]>selectorSource.options).includes(currentValue)) {
                return;
            }

            // set the value to the default specified in the selector source
            map[type].action(context, selectorSource.default);
        });
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
        const newVal = new Range(value.min, value.max);
        context.commit('SET_CHART_RANGE', newVal);
    },

    clearChart(context: AppContext): void {
        context.commit('SET_CHART_RANGE', null);
        context.commit('SET_CHART_SERIES', null);
    },

    clearFeature(context: AppContext): void {
        context.commit('SET_FEATURE_ID', null);
        context.commit('SET_FEATURE_POINT', null);
    },

    setInternalRouteUpdate(context: AppContext, value: boolean): void {
        context.commit('SET_INTERNAL_ROUTE_UPDATE', value);
    }
};

// mutations
const mutations = {
    SET_CURRENT_VIEW(state: AppState, value: ViewType): void {
        state.currentView = value;
    },

    SET_TIME_PERIOD_ID(state: AppState, value: string): void {
        state.timePeriodId = value;
    },

    SET_VARIABLE_ID(state: AppState, value: string): void {
        state.variableId = value;
    },

    SET_DATASET_ID(state: AppState, value: DatasetId): void {
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
    },

    SET_INTERNAL_ROUTE_UPDATE(state: AppState, value: boolean): void {
        state.internalRouteUpdate = value;
    }
};

export const app: StoreOptions<AppState> = {
    state,
    getters,
    actions,
    mutations
};
