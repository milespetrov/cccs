interface controlConfig {
    [key: string] : {
        [key: string]: string[]
    }
}

const config: controlConfig = {
    ahccd: {
        'map-view': ['var', 'dataset'],
        'chart-view': ['var', 'dataset', 'period']
    },
    cmip5: {
        'map-view': ['var', 'dataset', 'period'],
        'chart-view': ['var', 'dataset', 'rcp', 'period']
    },
    cangrd: {
        'map-view': ['var', 'dataset', 'period'],
        'chart-view': ['var', 'dataset', 'period']
    }
}

export default {
    config
}