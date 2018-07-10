import { DatasetApi } from './types';
import { AppState } from '@/store';

const BASE_MAP_URL = './assets/configs/AHCCD';

/**
 * @class AHCCDApi
 *
 * @method getData returns data for the current feature/variable
 * @method getTrend returns the trend value for the current feature/variable for the specified start and end years
 */
class AHCCDApi extends DatasetApi {
    /**
     * Returns an array of data layers for the current state.
     *
     * @param configVersion version grabbed from the config storage
     */
    async getDataLayers(configVersion: string): Promise<any[]> {
        const fetchUrl = `${BASE_MAP_URL}/${configVersion}/layer-configs.json`;
        const result = await $.getJSON(fetchUrl);

        return result[this.state.variableId!];
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
    return new AHCCDApi(state);
}
