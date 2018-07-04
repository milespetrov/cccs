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
     * AHCCD has no reference layers (currently), return an empty array
     */
    getReferenceLayers() {
        return [];
    }
}

export default function(state: AppState) {
    return new AHCCDApi(state);
}
