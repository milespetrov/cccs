import { DatasetApi } from './types';
import { getJSON } from './util';
import { DatasetId } from '@/types';
import { AppState } from '@/store';

const BASE_API_URL = 'https://cmip5dev.azurewebsites.net';
const BASE_MAP_URL = './assets/configs/CMIP5';

/**
 * @class CMIP5Api
 */
class CMIP5Api extends DatasetApi {
    /**
     * Returns all 5 percentile lines for the current state
     *
     */
    async getData(): Promise<any> {
        const fetchUrl = `${BASE_API_URL}/time_series/${this.state.featureId}/${this.state.variableId}/${
            this.state.rcpId
        }/${this.state.timePeriodId}`;
        const data = await getJSON<any>(fetchUrl, DatasetId.CMIP5, 'getData');

        return data;
    }

    /**
     * Returns an array of coordinates for the cmip5 grid square that 'xy' is in
     * Also returns the gridId that contains the point
     *
     * @param xy the x and y (latlong) to find the geometry for
     */
    async getGeometryPoints(xy: { x: number; y: number }): Promise<{ coordinates: any; gridId: any }> {
        const fetchUrl = `${BASE_API_URL}/grid_id/${xy.x},${xy.y}`;
        const data = await getJSON<any>(fetchUrl, DatasetId.CMIP5, 'getGeometryPoints');

        const result = {
            coordinates: data.geometry.coordinates[0],
            gridId: data.properties.grid_id
        };

        return result;
    }

    /**
     * Returns an array of data layers for the current state.
     *
     * @param configVersion version grabbed from the config storage
     */
    async getDataLayers(configVersion: string): Promise<any[]> {
        const fetchUrl = `${BASE_MAP_URL}/${configVersion}/cmip5-layer-configs-${this.state.variableId}-${
            this.state.timePeriodId
        }-${this.state.rcpId}.json`;
        const result = await $.getJSON(fetchUrl);

        return result.layers;
    }

    /**
     * Returns an array of reference layers for cmip5
     *
     * @param configVersion version grabbed from the config storage
     */
    async getReferenceLayers(configVersion: string): Promise<any[]> {
        const fetchUrl = `${BASE_MAP_URL}/${configVersion}/reference-layers.json`;
        const result = await $.getJSON(fetchUrl);

        return result.layers;
    }
}

export default function(state: AppState) {
    return new CMIP5Api(state);
}
