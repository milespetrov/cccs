/**
 * All available chart config types.
 *
 * @export
 * @enum {number}
 */
export enum ChartConfigType {
    FOCUS = 'focus',
    GLANCE = 'glance'
}

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

    /**
     * Mean temperature.
     */
    TMean = 'tmean',
    Precipitation = 'precip',
    SurfaceWind = 'sfcwind',
    IceThickness = 'sit',
    IceConcentration = 'sic',
    SnowDepth = 'snd'
}

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
export enum StageType {
    Future = 'future',
    Historic = 'historic'
}

/**
 * All available RCP model ids.
 *
 * @enum {string}
 */
export enum RCPType {
    RCP2_6 = 'rcp26',
    RCP4_5 = 'rcp45',
    RCP8_5 = 'rcp85'
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
    Winter = 'winter',
    Spring = 'spring',
    Summer = 'summer',
    Autumn = 'fall',
    Annual = 'annual'
}

export enum ViewType {
    MapView = 'map-view',
    ChartView = 'chart-view'
}
