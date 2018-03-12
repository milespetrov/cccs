import { DatasetId, VariableId } from './../datasets/types';

/**
 * All available Visualization controls which can be added to the visualization view.
 *
 * @enum {string}
 */
export enum VisualizationControlType {
    Variable = 'variable-selector',
    Dataset = 'dataset-selector',
    RCP = 'rcp-selector',
    Time = 'time-period-selector'
}

/**
 * Variable stage group ids for the variable selector.
 *
 * @enum {string}
 */
export enum VariableStageType {
    Future = 'future',
    Historic = 'historic'
}

/**
 * Specifies which Datasets represent Future and Historic data for a specific variable.
 * The first dataset in the list will be used when changin variable in the variable selector.
 *
 * @export
 * @interface VariableStageMap
 */
export interface VariableStageMap {
    [VariableStageType.Historic]?: DatasetId[];
    [VariableStageType.Future]?: DatasetId[];
}

/**
 * Map Variable Futuren and Historic stages to datasets.
 *
 * @export
 * @interface VariableStageMapping
 */
export interface VariableStageMapping {
    [name: string]: VariableStageMap;
}

/**
 * All available RCP model ids.
 *
 * @enum {string}
 */
export enum RCPType {
    RCP2_6 = '2_6',
    RCP4_5 = '4_5',
    RCP8_5 = '8_5'
}

/**
 * All available TimePeriod ids.
 *
 * @enum {string}
 */
export enum TimePeriodType {
    January = 'Jan_Janv',
    February = 'Feb_Fev',
    March = 'Mar_March',
    April = 'Apr_Avr',
    May = 'May_Mai',
    June = 'June_Juin',
    July = 'July_Juil',
    August = 'Aug_Aout',
    September = 'Sept_Sept',
    October = 'Oct_Oct',
    November = 'Nov_Nov',
    December = 'Dec_Dec',
    Winter = 'Winter_Hiver',
    Spring = 'Spring_Printemp',
    Summer = 'Summer_Ete',
    Autumn = 'Autumn_Autome',
    Annual = 'Annual_Annuel'
}

/**
 * Selector group base interface.
 *
 * @interface BaseSelectorGroupConfig
 */
export interface BaseSelectorGroupConfig {
    /**
     * The id of the selector group.
     *
     * @type {string}
     * @memberof BaseSelectorGroupConfig
     */
    id: string;

    /**
     * A list of options available in this group.
     *
     * @type {string[]}
     * @memberof BaseSelectorGroupConfig
     */
    items: string[];
    /**
     * Specifies if the group's header should be shown or not.
     * Default: undefined - the header is shown only if there are more than one item in the group.
     * true - always show
     * false - always hide
     *
     * @type {boolean}
     * @memberof TimePeriodSelectorGroupConfig
     */
    showHeader?: boolean;
}

/**
 * Selector config base interface.
 *
 * @interface BaseSelectorConfig
 */
export interface BaseSelectorConfig {
    /**
     * A list of groups to display in the selector.
     *
     * @type {BaseSelectorGroupConfig[]}
     * @memberof BaseSelectorConfig
     */
    groups: BaseSelectorGroupConfig[];
}

/**
 *  Configuration of the TimePeriodGroup in the TimePeriod selector.
 *
 * @interface TimePeriodSelectorGroupConfig
 * @extends {BaseSelectorGroupConfig}
 */
export interface TimePeriodSelectorGroupConfig extends BaseSelectorGroupConfig {
    items: TimePeriodType[];
}

/**
 * Configuration of the TimePeriod selector.
 *
 * @interface TimePeriodSelectorConfig
 */
export interface TimePeriodSelectorConfig extends BaseSelectorConfig {
    groups: TimePeriodSelectorGroupConfig[];
}

///////////

// RCP Selector Config

/**
 * Configuration of the RCPGroup in the RCP selector.
 *
 * @interface RCPSelectorGroupConfig
 * @extends {BaseSelectorGroupConfig}
 */
export interface RCPSelectorGroupConfig extends BaseSelectorGroupConfig {
    items: string[];
}

/**
 * Configuration of the RCP selector.
 *
 * @interface RCPSelectorConfig
 * @extends {BaseSelectorConfig}
 */
export interface RCPSelectorConfig extends BaseSelectorConfig {
    groups: RCPSelectorGroupConfig[];
}

// example

////////

// Dataset Selector Config

/**
 * Configuration of the DatasetGroup in the Dataset selector.
 *
 * @interface DatasetSelectorGroupConfig
 * @extends {BaseSelectorGroupConfig}
 */
export interface DatasetSelectorGroupConfig extends BaseSelectorGroupConfig {
    items: DatasetId[];
}

/**
 * Configuration of the Dataset selector.
 *
 * @interface DatasetSelectorConfig
 * @extends {BaseSelectorConfig}
 */
export interface DatasetSelectorConfig extends BaseSelectorConfig {
    groups: DatasetSelectorGroupConfig[];
}

// example

////////

export interface VariableSelectorGroupConfig extends BaseSelectorGroupConfig {
    items: VariableId[];
}

export interface VariableSelectorConfig extends BaseSelectorConfig {
    groups: VariableSelectorGroupConfig[];
}
