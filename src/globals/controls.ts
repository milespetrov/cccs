interface ControlConfig {
    [key: string]: {
        [key: string]: string[];
    };
}

/**
 * Determines what selectors are available on each view
 * Use the dataset id as the first level, 'map-view' and 'chart-view' on the second level
 * and the proper component id in the array
 *
 * NOTE: these are displayed in order, please follow the proper order so controls stay in the right place (var, dataset, ...)
 */
const config: ControlConfig = {
    ahccd: {
        'map-view': [],
        'chart-view': ['time-period-selector']
    },
    cmip5: {
        'map-view': ['rcp-selector', 'time-period-selector'],
        'chart-view': ['rcp-selector', 'time-period-selector']
    },
    cangrd: {
        'map-view': ['time-period-selector'],
        'chart-view': ['time-period-selector']
    },
    default: {
        'map-view': ['variable-selector', 'dataset-selector'],
        'chart-view': ['variable-selector', 'dataset-selector']
    }
};

export default {
    config
};
