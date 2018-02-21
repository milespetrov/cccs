interface controlConfig {
    [key: string] : {
        [key: string]: string[]
    }
}


/**
 * Determines what selectors are available on each view
 * Use the dataset id as the first level, 'map-view' and 'chart-view' on the second level
 * and the proper component id in the array
 * 
 * NOTE: these are displayed in order, please follow the proper order so controls stay in the right place (var, dataset, ...)
 */
const config: controlConfig = {
    ahccd: {
        'map-view': ['variable-selector', 'dataset-selector'],
        'chart-view': ['variable-selector', 'dataset-selector', 'time-period-selector']
    },
    cmip5: {
        'map-view': ['variable-selector', 'dataset-selector', 'rcp-selector', 'time-period-selector'],
        'chart-view': ['variable-selector', 'dataset-selector', 'rcp-selector', 'time-period-selector']
    },
    cangrd: {
        'map-view': ['variable-selector', 'dataset-selector', 'time-period-selector'],
        'chart-view': ['variable-selector', 'dataset-selector', 'time-period-selector']
    }
}

export default {
    config
}