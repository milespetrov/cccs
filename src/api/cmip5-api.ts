import { DatasetApi } from './types';

function getData(timePeriod: string, variable: string, featureId: string): Promise<any[]> {
    const promise = new Promise<any[]>((resolve, reject) =>
        $.getJSON('./assets/configs/sfcWindSample.json', (data: any[]) => resolve(data))
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
        $.getJSON(`https://cmip5dev.azurewebsites.net/grid_id/${xy.x},${xy.y}`, (data: any) =>
            // return the coordinates for the grid
            resolve(data.geometry.coordinates[0])
        )
    );
    return promise;
}

export default <DatasetApi>{
    getData,
    getGeometryPoints
};
