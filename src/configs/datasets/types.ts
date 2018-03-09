import { TimePeriodType, RCPType, VariableStageType, VisualizationControlType } from './../selectors/types';
import { ViewType } from '../../store';

/**
 * All available Dataset ids.
 *
 * @enum {string}
 */
export enum DatasetId {
    AHCCD = 'ahccd',
    CMIP5 = 'cmip5',
    CANGRD = 'cangrd',
    DCS = 'dcs'
}

/**
 * All available Variable across all Datasets ids.
 *
 * @enum {string}
 */
export enum VariableId {
    TMin = 'tmin',
    TMax = 'tmax',
    TMean = 'tmean',
    SurfaceWind = 'surface-wind'
}

/**
 * Configuration options for the TimePeriod selector.
 *
 * @interface DatasetTimeSelectorSource
 */
export interface DatasetTimeSelectorSource {
    /**
     * Specifies the option selected by default.
     *
     * @type {TimePeriodType}
     * @memberof DatasetTimeSelectorSource
     */
    default: TimePeriodType;
    /**
     * Specifies a list of TimePeriod options available for this Dataset.
     * Only options specified here will be available in the Selector when this Dataset is selected.
     *
     * If not provided, all the available options are used.
     *
     * @type {TimePeriodType[]}
     * @memberof DatasetTimeSelectorSource
     */
    options?: TimePeriodType[];
}

/**
 * Configuration options for the RCP selector.
 *
 * @interface DatasetRCPSelectorSource
 */
export interface DatasetRCPSelectorSource {
    /**
     * Specifies the option selected by default.
     *
     * @type {RCPType}
     * @memberof DatasetRCPSelectorSource
     */
    default: RCPType;
    /**
     * Specifies a list of RCP options available for this Dataset.
     * Only options specified here will be available in the Selector when this Dataset is selected.
     *
     * @type {RCPType[]}
     * @memberof DatasetRCPSelectorSource
     */
    options: RCPType[];
}

/**
 * Configuration options for the visualization view.
 *
 * @interface DatasetViewSource
 */
export interface DatasetViewSource {
    /**
     * Provides RCP selector options.
     *
     * @type {DatasetRCPSelectorSource}
     * @memberof DatasetViewSource
     */
    [VisualizationControlType.RCP]?: DatasetRCPSelectorSource;
    /**
     * Provides TimePeriod selector options.
     *
     * @type {DatasetTimeSelectorSource}
     * @memberof DatasetViewSource
     */
    [VisualizationControlType.Time]?: DatasetTimeSelectorSource;
}

/**
 * Configuration options for a Dataset Variable.
 *
 * @interface DatasetVariableSource
 */
export interface DatasetVariableSource {
    /**
     * Variable id.
     *
     * @type {VariableId}
     * @memberof DatasetVariableSource
     */
    id: VariableId;
    /**
     * Specifies if this Variable provides Future or Historic data under this Dataset.
     * This affects which Datasets will be displayed in the Dataset selector when a certain Variable is selected.
     *
     * @type {VariableStageType}
     * @memberof DatasetVariableSource
     */
    stage: VariableStageType;
}

/**
 * Configuration optiosn for a Dataset.
 *
 * @interface DatasetSource
 */
export interface DatasetSource {
    /**
     * Dataset id.
     *
     * @type {string}
     * @memberof DatasetSource
     */
    id: string;

    /**
     * Provides chart view visualization options.
     *
     * @type {DatasetViewSource}
     * @memberof DatasetSource
     */
    [ViewType.ChartView]: DatasetViewSource;
    /**
     * Provides map view visualization options.
     *
     * @type {DatasetViewSource}
     * @memberof DatasetSource
     */
    [ViewType.MapView]: DatasetViewSource;

    /**
     * A list of Variable configuration options.
     * Only variables present in this list will be displayed in the Variable Selector.
     *
     * @type {DatasetVariableSource[]}
     * @memberof DatasetSource
     */
    variables: DatasetVariableSource[];

    /**
     * A path to them base map config.
     *
     * @type {string}
     * @memberof DatasetSource
     */
    mapConfigPath: string; // file.json
    /**
     * A path to the map config snippets providing appropriate layers for each Variable in this Dataset.
     *
     * @type {string}
     * @memberof DatasetSource
     */
    layersConfigPath: string; // file2.json
}
