import { StageType, TimePeriodType, DatasetId, VariableId } from '@/types';

/**
 * Specifies which Datasets represent Future and Historic data for a specific variable.
 * The first dataset in the list will be used when changin variable in the variable selector.
 *
 * @export
 * @interface StageMap
 */
export interface StageMap {
    [StageType.Historic]?: DatasetId[];
    [StageType.Future]?: DatasetId[];
}

/**
 * Map Variable Futuren and Historic stages to datasets.
 *
 * @export
 * @interface StageMapping
 */
export interface StageMapping {
    [name: string]: StageMap;
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

export interface VariableSelectorGroupConfig extends BaseSelectorGroupConfig {
    items: VariableId[];
}

export interface VariableSelectorConfig extends BaseSelectorConfig {
    groups: VariableSelectorGroupConfig[];
}
