import { DatasetApi } from './types';
import { getJSON } from './util';
import { TimePeriodType, DatasetId } from '@/types';

const BASE_API_URL = 'https://cmip5dev.azurewebsites.net';

/**
 * The cmip5 api period keys
 */
// TODO: figure out which set of period keys should be everywhere and use those
const periodMappings: { [key: string]: string } = {
    Winter_Hiver: 'winter',
    Spring_Printemp: 'spring',
    Summer_Ete: 'summer',
    Autumn_Autome: 'fall',
    Annual_Annuel: 'annual'
};

/**
 * Returns all 5 percentile lines for a given gridId, variable, rcp and period
 *
 * @param timePeriod time period from state
 * @param variable variable from state
 * @param featureId feature from state
 * @param rcpId rcp from state
 */
async function getData(timePeriod: string, variable: string, featureId: string, rcpId: string): Promise<any[]> {
    const fetchUrl = `${BASE_API_URL}/time_series/${featureId}/${variable}/${rcpId}/${periodMappings[timePeriod]}`;
    const data = await getJSON<any[]>(fetchUrl, DatasetId.CMIP5, 'getData');

    return data;
}

/**
 * Returns an array of coordinates for the cmip5 grid square that 'xy' is in
 *
 * @param xy the x and y (latlong) to find the geometry for
 * @returns an array of coordinates to build a grid polygon
 */
async function getGeometryPoints(xy: { x: number; y: number }): Promise<{ coordinates: any; gridId: any }> {
    const fetchUrl = `${BASE_API_URL}/grid_id/${xy.x},${xy.y}`;
    const data = await getJSON<any>(fetchUrl, DatasetId.CMIP5, 'getGeometryPoints');

    const result = {
        coordinates: data.geometry.coordinates[0],
        gridId: data.properties.grid_id
    };

    return result;
}

export default <DatasetApi>{
    getData,
    getGeometryPoints,
    periodMappings
};
