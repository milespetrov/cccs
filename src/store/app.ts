import { ActionContext, Store, StoreOptions, Module } from 'vuex';

import { AppState, MapPoint, Range, RootState } from './index';

import controls from './../globals/controls';

import { chartConfigGenerators, ChartConfigGenerator } from '../configs/charts';
import { datasets, DatasetSource, DatasetViewSource, ColourRamp } from './../configs/datasets';
import { defaultSelectors } from './../configs/selectors';
import { VisualizationControlType, ViewType, DatasetId } from '@/types';
import { DatasetApi, datasetApis } from '@/api';

type AppContext = ActionContext<AppState, RootState>;

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
    timeSlice: null,

    // Does not belong
    internalRouteUpdate: false
};

enum Action {
    applyDatasetDefault = 'applyDatasetDefault',
    clearChart = 'clearChart',
    clearFeature = 'clearFeature',
    setCenterPoint = 'setCenterPoint',
    setChartRange = 'setChartRange',
    setChartSeries = 'setChartSeries',
    setCurrentView = 'setCurrentView',
    setDatasetId = 'setDatasetId',
    setFeatureId = 'setFeatureId',
    setFeaturePoint = 'setFeaturePoint',
    setInternalRouteUpdate = 'setInternalRouteUpdate',
    setMapPin = 'setMapPin',
    setRcpId = 'setRcpId',
    setTimeSlice = 'setTimeSlice',
    setTimePeriodId = 'setTimePeriodId',
    setVariableId = 'setVariableId',
    setZoomLevel = 'setZoomLevel'
}

enum Mutation {
    SET_CENTER_POINT = 'SET_CENTER_POINT',
    SET_CHART_RANGE = 'SET_CHART_RANGE',
    SET_CHART_SERIES = 'SET_CHART_SERIES',
    SET_CURRENT_VIEW = 'SET_CURRENT_VIEW',
    SET_DATASET_ID = 'SET_DATASET_ID',
    SET_FEATURE_ID = 'SET_FEATURE_ID',
    SET_FEATURE_POINT = 'SET_FEATURE_POINT',
    SET_INTERNAL_ROUTE_UPDATE = 'SET_INTERNAL_ROUTE_UPDATE',
    SET_MAP_PIN = 'SET_MAP_PIN',
    SET_RCP_ID = 'SET_RCP_ID',
    SET_RCP_TIME_SLICE = 'SET_RCP_TIME_SLICE',
    SET_TIME_PERIOD_ID = 'SET_TIME_PERIOD_ID',
    SET_VARIABLE_ID = 'SET_VARIABLE_ID',
    SET_ZOOM_LEVEL = 'SET_ZOOM_LEVEL'
}

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
            cs: state.chartSeries ? state.chartSeries.toString() : null,
            cr: state.chartRange ? state.chartRange.safeString : null,
            ts: state.timeSlice !== null ? state.timeSlice.toString() : null
        };

        // remove null values from the query object
        Object.keys(queryObject).forEach(key => queryObject[key] === null && delete queryObject[key]);

        return queryObject;
    },

    /**
     * Returns a list of VisualizationControlType string specifying which controls shoudl be visible in the new view.
     *
     * @param {AppState} state
     * @returns {VisualizationControlType[]}
     */
    getControls: (state: AppState): VisualizationControlType[] => {
        const options = getters.datasetControlOptions(state);

        // filter out visualization control ids which corresponding configurations are set to be invisible
        const controls = Object.entries(options.controls).reduce<VisualizationControlType[]>((map, [key, value]) => {
            if (value!.visible !== false) {
                map.push(key as VisualizationControlType);
            }
            return map;
        }, []);

        return defaultSelectors.concat(controls);
    },

    datasetControlOptions: (state: AppState): DatasetViewSource => {
        return datasets[state.datasetId!].views[state.currentView!];
    },

    timeSliderLabels: (state: AppState): string[] | undefined => {
        return datasets[state.datasetId!].timeSliderLabels;
    },

    colourRamp: (state: AppState): ColourRamp | null => {
        // check if dataset config specifies the colour ramp at all
        const dataset = datasets[state.datasetId!];
        if (!dataset || !dataset.colourRamp) {
            return null;
        }

        // get the default colour ramp
        const defaultColourRamp: ColourRamp = {
            colours: dataset.colourRamp.defaultColours,
            labels: dataset.colourRamp.defaultLabels
        };

        // check if a colour ramp is specified for the current variable
        const variableColourRamp = dataset.colourRamp.variables[state.variableId!];
        if (!variableColourRamp) {
            return defaultColourRamp;
        }

        // apply defaults to the colour ramp of the current variable
        const defaultedVariableColourRamp: ColourRamp = { ...defaultColourRamp, ...variableColourRamp };

        return defaultedVariableColourRamp;
    },

    /**
     * Returns a chart config generator object based on the current state values.
     *
     * @param {AppState} state
     * @returns {ChartConfigGenerator} config generator
     */
    chartConfigGenerator(state: AppState): ChartConfigGenerator {
        // TODO: decide on the way to check for existence of state items like `datasetId`
        return chartConfigGenerators[state.datasetId!](state);
    },

    datasetApi(state: AppState): DatasetApi {
        return datasetApis[state.datasetId!];
    }
};

// actions
const actions = {
    [Action.setCurrentView](context: AppContext, value: ViewType) {
        context.commit(Mutation.SET_CURRENT_VIEW, value);

        context.dispatch(Action.applyDatasetDefault);
    },

    [Action.setTimePeriodId](context: AppContext, value: string | null) {
        context.commit(Mutation.SET_TIME_PERIOD_ID, value);
    },

    [Action.setVariableId](context: AppContext, value: string | null) {
        context.commit(Mutation.SET_VARIABLE_ID, value);
    },

    [Action.setDatasetId](context: AppContext, value: DatasetId) {
        context.commit(Mutation.SET_DATASET_ID, value);

        context.dispatch(Action.applyDatasetDefault);
    },

    /**
     * Apply the default selector values (time period and rcp model if provided) specified in the new dataset configuration.
     *
     * @param {AppContext} context
     * @returns {void}
     */
    [Action.applyDatasetDefault](context: AppContext): void {
        // both dataset and view must be set to apply the dataset defaults
        if (!context.state.currentView || !context.state.datasetId) {
            return;
        }

        //TODO: check why getters aren't typed
        const datasetControlOptions = context.getters.datasetControlOptions as DatasetViewSource;

        // map relevant actions and state accessors agaisnt the visualization control types
        const map: {
            [name: string]: { action: (value: string | null) => void; state: string | null };
        } = {
            [VisualizationControlType.Time]: {
                action: (value: string) => context.dispatch(Action.setTimePeriodId, value),
                state: context.state.timePeriodId
            },
            [VisualizationControlType.RCP]: {
                action: (value: string) => context.dispatch(Action.setRcpId, value),
                state: context.state.rcpId
            }
        };

        [VisualizationControlType.Time, VisualizationControlType.RCP].forEach(type => {
            // if the selector is not defined for this dataset/view combination, reset the value to null
            const selectorSource = datasetControlOptions.controls[type];
            if (!selectorSource) {
                map[type].action(null);
                return;
            }

            const newValue = map[type].state;
            // falsy options specified on the dataset configuration indicate that all available selector options will be used
            // leave the newly selected option in place
            if (newValue && !selectorSource.options) {
                return;
            }

            // if the newly set value is one of the options specified on the dataset config, leave it in place
            if (newValue && (<string[]>selectorSource.options).includes(newValue)) {
                return;
            }

            // set the value to the default specified in the selector source
            map[type].action(selectorSource.default);
        });
    },

    [Action.setFeatureId](context: AppContext, value: string | null) {
        context.commit(Mutation.SET_FEATURE_ID, value);
    },

    [Action.setFeaturePoint](context: AppContext, value: { x: number; y: number } | string | null): void {
        let point;

        if (value === null) {
            point = null;
        } else if (typeof value !== 'string') {
            point = new MapPoint(value.x, value.y);
        } else {
            const [x, y] = value.split(',');
            point = new MapPoint(parseFloat(x), parseFloat(y));
        }

        context.commit(Mutation.SET_FEATURE_POINT, point);
    },

    [Action.setRcpId](context: AppContext, value: string | null) {
        context.commit(Mutation.SET_RCP_ID, value);
    },

    [Action.setTimeSlice](context: AppContext, value: number | string | null) {
        if (typeof value === 'string') {
            value = parseInt(value);
        }
        context.commit(Mutation.SET_RCP_TIME_SLICE, value);
    },

    [Action.setCenterPoint](context: AppContext, value: { x: number; y: number } | string | null): void {
        let point;

        if (value === null) {
            point = null;
        } else if (typeof value !== 'string') {
            point = new MapPoint(value.x, value.y);
        } else {
            const [x, y] = value.split(',');
            point = new MapPoint(parseFloat(x), parseFloat(y));
        }

        context.commit(Mutation.SET_CENTER_POINT, point);
    },

    [Action.setZoomLevel](context: AppContext, value: string | null) {
        context.commit(Mutation.SET_ZOOM_LEVEL, value);
    },

    [Action.setMapPin](context: AppContext, value: { x: number; y: number } | string | null): void {
        let point;

        if (value === null) {
            point = null;
        } else if (typeof value !== 'string') {
            point = new MapPoint(value.x, value.y);
        } else {
            const [x, y] = value.split(',');
            point = new MapPoint(parseFloat(x), parseFloat(y));
        }

        context.commit(Mutation.SET_MAP_PIN, value);
    },

    [Action.setChartRange](context: AppContext, value: { min: number; max: number } | null) {
        if (value) {
            value = new Range(value.min, value.max);
        }
        context.commit(Mutation.SET_CHART_RANGE, value);
    },

    [Action.clearChart](context: AppContext): void {
        context.commit(Mutation.SET_CHART_RANGE, null);
        context.commit(Mutation.SET_CHART_SERIES, null);
    },

    [Action.clearFeature](context: AppContext): void {
        context.commit(Mutation.SET_FEATURE_ID, null);
        context.commit(Mutation.SET_FEATURE_POINT, null);
    },

    [Action.setInternalRouteUpdate](context: AppContext, value: boolean): void {
        context.commit(Mutation.SET_INTERNAL_ROUTE_UPDATE, value);
    },

    [Action.setChartSeries](context: AppContext, value: number[] | string | null): void {
        if (value === [] || value === '') {
            value = null;
        } else if (typeof value === 'string') {
            // convert string into number[]
            value = value.split(',').map(val => {
                return parseInt(val);
            });
        }
        context.commit(Mutation.SET_CHART_SERIES, value);
    }
};

// mutations
const mutations = {
    [Mutation.SET_CURRENT_VIEW](state: AppState, value: ViewType): void {
        state.currentView = value;
    },

    [Mutation.SET_TIME_PERIOD_ID](state: AppState, value: string): void {
        state.timePeriodId = value;
    },

    [Mutation.SET_VARIABLE_ID](state: AppState, value: string): void {
        state.variableId = value;
    },

    [Mutation.SET_DATASET_ID](state: AppState, value: DatasetId): void {
        state.datasetId = value;
    },

    [Mutation.SET_FEATURE_ID](state: AppState, value: string): void {
        state.featureId = value;
    },

    [Mutation.SET_FEATURE_POINT](state: AppState, value: MapPoint | null): void {
        state.featurePoint = value;
    },

    [Mutation.SET_RCP_ID](state: AppState, value: string): void {
        state.rcpId = value;
    },

    [Mutation.SET_RCP_TIME_SLICE](state: AppState, value: number | null): void {
        state.timeSlice = value;
    },

    [Mutation.SET_CENTER_POINT](state: AppState, value: MapPoint | null): void {
        state.centerPoint = value;
    },

    [Mutation.SET_ZOOM_LEVEL](state: AppState, value: string | null): void {
        state.zoomLevel = value;
    },

    [Mutation.SET_MAP_PIN](state: AppState, value: MapPoint): void {
        state.mapPin = value;
    },

    [Mutation.SET_CHART_RANGE](state: AppState, value: Range | null): void {
        state.chartRange = value;
    },

    [Mutation.SET_CHART_SERIES](state: AppState, value: number[] | null): void {
        state.chartSeries = value;
    },

    [Mutation.SET_INTERNAL_ROUTE_UPDATE](state: AppState, value: boolean): void {
        state.internalRouteUpdate = value;
    }
};

export const app: StoreOptions<AppState> = {
    state,
    getters,
    actions,
    mutations
};
