import { DatasetApi } from './types';
import { TimePeriodType } from '@/types';

const baseApiUrl = 'https://cmip5dev.azurewebsites.net';

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
function getData(timePeriod: string, variable: string, featureId: string, rcpId: string): Promise<any[]> {
    const promise = new Promise<any[]>((resolve, reject) =>
        $.getJSON(
            `${baseApiUrl}/time_series/${featureId}/${variable}/${rcpId}/${periodMappings[timePeriod]}`,
            (data: any[]) => resolve(data)
        )
    );

    return promise;
}

/**
 * Returns an array of coordinates for the cmip5 grid square that 'xy' is in
 *
 * @param xy the x and y (latlong) to find the geometry for
 * @returns an array of coordinates to build a grid polygon
 */
function getGeometryPoints(xy: { x: number; y: number }): Promise<any[]> {
    const promise = new Promise<any>((resolve, reject) =>
        $.getJSON(`${baseApiUrl}/grid_id/${xy.x},${xy.y}`, (data: any) =>
            // return the coordinates for the grid
            resolve({
                coordinates: data.geometry.coordinates[0],
                gridId: data.properties.grid_id
            })
        )
    );
    return promise;
}

export default <DatasetApi>{
    getData,
    getGeometryPoints,
    periodMappings
};
