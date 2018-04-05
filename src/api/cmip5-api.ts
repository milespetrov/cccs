import { DatasetApi } from './types';

function getData(timePeriod: string, variable: string, featureId: string): Promise<any[]> {
    const promise = new Promise<any[]>((resolve, reject) =>
        $.getJSON('./assets/configs/sfcWindSample.json', (data: any[]) => resolve(data))
    );

    return promise;
}

function getGeometryPoints(xy: { x: number; y: number }): Promise<any[]> {
    const promise = new Promise<any>((resolve, reject) =>
        $.getJSON(`https://cmip5dev.azurewebsites.net/grid_id/${xy.x},${xy.y}`, (data: any) =>
            resolve(data.geometry.coordinates[0])
        )
    );
    return promise;
}

export default <DatasetApi>{
    getData,
    getGeometryPoints
};
