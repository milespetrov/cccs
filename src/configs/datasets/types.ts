import { VariableId, TimePeriodType, RCPType, VisualizationControlType, IdentifyMode } from '@/types';

export interface BaseDatasetSelectorSource {
    /**
     * Specifies whether the selector is visible to the user and can be manipulated by the user.
     * If not explicitly set to false, the selector should be rendered.
     *
     * @type {boolean}
     * @memberof BaseDatasetSelectorSource
     */
    visible?: boolean;
    default: string;
    options?: string[];
    disableOn?: string[];
}

/**
 * Configuration options for the TimePeriod selector.
 *
 * @interface DatasetTimeSelectorSource
 */
export interface DatasetTimeSelectorSource extends BaseDatasetSelectorSource {
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

    disableOn?: VariableId[];
}

/**
 * Configuration options for the RCP selector.
 *
 * @interface DatasetRCPSelectorSource
 */
export interface DatasetRCPSelectorSource extends BaseDatasetSelectorSource {
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
    options?: RCPType[];

    disableOn?: VariableId[];
}

/**
 * Configuration options for the visualization view.
 *
 * @interface DatasetViewSource
 */
export interface DatasetViewSource {
    /**
     * Contains configuration for different controls available in this view.
     *
     * @type {({
     *         [VisualizationControlType.RCP]?: DatasetRCPSelectorSource;
     *         [VisualizationControlType.Time]?: DatasetTimeSelectorSource;
     *     })}
     * @memberof DatasetViewSource
     */
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
    // TODO: because two items above are options, an explicit index is required, but the `VisualizationControlType` enum can't be used
    // in the index, so this is not completely type safe
    [key: string]: BaseDatasetSelectorSource | undefined;
}

/**
 * A colour ramp configuration for a specific variable.
 *
 * @export
 * @interface ColourRamp
 */
export interface ColourRamp {
    /**
     * A list of colour ramp colour hex values to be used.
     *
     * @type {string[]}
     * @memberof ColourRamp
     */
    colours?: string[] | string[][];
    /**
     * A list of colour ramp labels to be used.
     * Right now only two labels are supported on either sides of the colour ramp representing extreme values.
     *
     * @type {[string, string]}
     * @memberof ColourRamp
     */
    labels?: [string, string];
    /**
     * A list of labels and positions (by percentage) for ticks on the colour ramp.
     * 
     * @type {string[][]}
     * @memberof ColourRamp
     */
    ticks?: string[][];
}

/**
 * A colour ramp configuration for the dataset along with default values.
 *
 * @export
 * @interface DatasetColourRamp
 */
export interface DatasetColourRamp {
    /**
     * A list of default colour ramp colour hex values to be used. They can be overwritten by variable-specific colour ramp configurations.
     *
     * @type {string[]}
     * @memberof DatasetColourRamp
     */
    defaultColours: string[] | string[][];
    /**
     * A list of default colour ramp labels to be used. They can be overwritten by variable-specific colour ramp configurations.
     * Right now only two labels are supported on either sides of the colour ramp representing extreme values.
     *
     * @type {[string, string]}
     * @memberof DatasetColourRamp
     */
    defaultLabels: [string, string];
    /**
     * A list of default labels and positions (by percentage) for ticks on the colour ramp. 
     * They can be overwritten by variable-specific colour ramp configurations.
     * 
     * @type {string[][]}
     * @memberof ColourRamp
     */
    defaultTicks?: string[][];

    // TODO: use enum in the index signature when Typescript supports it
    variables?: { [name: string]: ColourRamp };
}

/**
 * Configuration options for a Dataset.
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
     * Provides map view visualization options.
     *
     * @type {DatasetViewSource}
     * @memberof DatasetSource
     */

    controls: DatasetViewSource;

    variables: VariableId[];

    timeSliderLabels?: string[];

    dateSlider?: any;

    legend?: {
        [index: string]: string;
    };

    /**
     * [optional] The configuration for the colour ramp to be displayed on the map.
     *
     * @type {DatasetColourRamp}
     * @memberof DatasetSource
     */
    colourRamp?: DatasetColourRamp;

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

    /**
     * Specifies the RAMP identify mode.
     *
     * @type {IdentifyMode[]}
     * @memberof DatasetSource
     */
    identifyMode: IdentifyMode[];
}
