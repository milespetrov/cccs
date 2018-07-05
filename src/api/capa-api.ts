import { DatasetApi } from './types';
import { AppState } from '@/store';

const BASE_MAP_URL = './assets/configs/CAPA';

/**
 * @class CAPAApi
 */
class CAPAApi extends DatasetApi {
    /**
     * Returns an array of data layers for the current state.
     *
     * @param configVersion version grabbed from the config storage
     */
    async getDataLayers(configVersion: string): Promise<any[]> {
        const fetchUrl = `${BASE_MAP_URL}/${configVersion}/capa-layer-configs-${this.state.variableId}-${
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
    return new CAPAApi(state);
}
