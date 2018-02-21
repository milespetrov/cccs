interface controlConfig {
    [key: string] : {
        [key: string]: string[]
    }
}

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