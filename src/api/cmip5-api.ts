import { DatasetApi } from './types';

function getData(timePeriod: string, variable: string, dataset: string, stnid: string): Promise<any[]> {
    const promise = new Promise<any[]>((resolve, reject) => {
        $.getJSON(`./../../assets/configs/sfcWindSample.json`, (data: any[]) => resolve(data));
    });

    return promise;
}

export default <DatasetApi>{
    getData
};
