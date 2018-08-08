/**
 * All available Dataset ids.
 *
 * @enum {string}
 */
export enum DatasetId {
    AHCCD = 'ahccd',
    CMIP5 = 'cmip5',
    CANGRD = 'cangrd',
    DCS = 'dcs',
    ClimateNormal = 'normal',
    ClimateMonthly = 'monthly',
    ClimateDaily = 'daily',
    CAPA = 'capa',
    Hydrometric = 'hydro'
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
    Precipitation = 'precip',
    SurfaceWind = 'sfcwind',
    IceThickness = 'sit',
    IceConcentration = 'sic',
    SnowDepth = 'snd',
    StationPressure = 'stnpress',
    SeaLevelPressure = 'seapress',
    GustSpeed = 'gustspeed',
    GustDirection = 'gustdir',
    Hydrometric = 'hydro',
    HRDPA = 'hrdpa',
    RDPA = 'rdpa',
    ClimateStations = 'stations',
    SurfaceTemp = 'tsurface',
    WaterTemp = 'twater',
    Geopotential = 'geopotential',
    GustDirection850 = 'gustdir850'
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
    January = 'jan',
    February = 'feb',
    March = 'mar',
    April = 'apr',
    May = 'may',
    June = 'jun',
    July = 'jul',
    August = 'aug',
    September = 'sep',
    October = 'oct',
    November = 'nov',
    December = 'dec',
    Winter = 'winter',
    Spring = 'spring',
    Summer = 'summer',
    Autumn = 'fall',
    Annual = 'annual'
}

export enum ViewType {
    MapView = 'map-view'
}
