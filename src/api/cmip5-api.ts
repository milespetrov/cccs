import { DatasetApi } from './types';
import { getJSON } from './util';
import { DatasetId, VariableId } from '@/types';
import { AppState } from '@/store';

const BASE_API_URL = 'https://cmip5dev.azurewebsites.net';
const BASE_MAP_URL = './assets/configs/CMIP5';

/**
 * @class CMIP5Api
 */
class CMIP5Api extends DatasetApi {
    //REMOVE THIS ONCE VARIABLES EXIST
    DEMO_MAPPINGS: { [key: string]: string } = {
        tmean: 'sfcwind',
        tmin: 'sic',
        tmax: 'sit',
        precip: 'sfcwind',
        sfcwind: 'sfcwind',
        sic: 'sic',
        sit: 'sit',
        snd: 'snd'
    };

    /**
     * Returns all 5 percentile lines for the current state
     *
     */
    async getData(): Promise<any> {
        const fetchUrl = `${BASE_API_URL}/time_series/${this.state.featureId}/${
            this.DEMO_MAPPINGS[this.state.variableId!]
        }/${this.state.rcpId}/${this.state.timePeriodId}`;
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
        const fetchUrl = `${BASE_MAP_URL}/${configVersion}/cmip5-layer-configs-${
            this.DEMO_MAPPINGS[this.state.variableId!]
        }-${this.state.timePeriodId}-${this.state.rcpId}.json`;
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

    /**
     * Returns an array of rows for a datatable. Values are properly rounded and appended with +/-
     */
    async getTableData() {
        const slices = ['2021-2040', '2041-2060', '2061-2080', '2081-2100'];
        const apiData = await $.getJSON(
            `${BASE_API_URL}/map_average/${this.DEMO_MAPPINGS[this.state.variableId!]}/${this.state.rcpId}/${
                this.state.timePeriodId
            }/${slices[this.state.timeSlice!]}`
        );

        /* Snow depth: round at 0.1 cm
        Wind speed: 0.1 m/s
        Sea ice concentration: 0.1%
        Sea ice thickness: 0.01 m */

        const tableData: any = [];
        const roundingAmount = this.state.variableId === VariableId.IceThickness ? 2 : 1;

        apiData.data.forEach((yl: any[], yi: number) => {
            yl.forEach((xl: number, xi: number) => {
                // round the value
                let actualValue: string = apiData.data[yi][xi].toFixed(roundingAmount);

                // append a '+' if needed
                if (parseInt(actualValue) >= 0) {
                    // some zeroes were showing up negative...
                    if (actualValue.startsWith('-')) {
                        actualValue = actualValue.slice(1);
                    }
                    actualValue = '+' + actualValue;
                }
                tableData.push([apiData.xmin + xi, apiData.ymin + yi, actualValue]);
            });
        });

        return tableData;
    }
}

export default function(state: AppState) {
    return new CMIP5Api(state);
}
