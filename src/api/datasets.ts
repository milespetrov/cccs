import { DatasetApi } from './types';
import { AppState } from '@/store';
import { DatasetId } from '@/types';

/**
 *
 *
 * @class AHCCDApi
 * @extends {DatasetApi}
 */
class AHCCDApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.AHCCD);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof AHCCDApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${
            this.state.timePeriodId
        }.json`;
    }
}

class CanGrdApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.CANGRD);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof CanGrdApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }
}

class CanSIPSApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.CanSIPS);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof CanSIPSApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }
}

class CAPAApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.CAPA);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof CAPAApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }
}

class CMIP5Api extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.CMIP5);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof CMIP5Api
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }

    /**
     * Returns an array of coordinates for the cmip5 grid square that 'xy' is in
     * Also returns the gridId that contains the point
     *
     * @param xy the x and y (latlong) to find the geometry for
     */
    /* async getGeometryPoints(xy: { x: number; y: number }): Promise<{ coordinates: any; gridId: any }> {
        const fetchUrl = `${BASE_API_URL}/grid_id/${xy.x},${xy.y}`;
        const data = await getJSON<any>(fetchUrl, DatasetId.CMIP5, 'getGeometryPoints');

        const result = {
            coordinates: data.geometry.coordinates[0],
            gridId: data.properties.grid_id
        };

        return result;
    } */
}

class DailyApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.ClimateDaily);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof DailyApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }
}

class MonthlyApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.ClimateMonthly);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof MonthlyApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }
}

class DCSApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.DCS);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof DCSApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }
}

class HydroApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.Hydrometric);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof HydroApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }
}

class NormalApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.ClimateNormal);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof NormalApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }
}

/**
 * A helper function to create a new DatasetAPI instance from the supplied Dataste type.
 * Returns a function accepting the current app state which in turns return an actual instance of the DatasetAPI.
 *
 * @param {new (state: AppState) => DatasetApi} datasetType
 * @returns
 */
function wrap(datasetType: new (state: AppState) => DatasetApi) {
    return (state: AppState) => new datasetType(state);
}

export default {
    [DatasetId.AHCCD]: wrap(AHCCDApi),
    [DatasetId.CANGRD]: wrap(CanGrdApi),
    [DatasetId.CanSIPS]: wrap(CanSIPSApi),
    [DatasetId.CAPA]: wrap(CAPAApi),
    [DatasetId.ClimateDaily]: wrap(DailyApi),
    [DatasetId.ClimateMonthly]: wrap(MonthlyApi),
    [DatasetId.ClimateNormal]: wrap(NormalApi),
    [DatasetId.CMIP5]: wrap(CMIP5Api),
    [DatasetId.DCS]: wrap(DCSApi),
    [DatasetId.Hydrometric]: wrap(HydroApi)
};
