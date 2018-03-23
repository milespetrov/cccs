import { DatasetApi } from './types';

function getData(timePeriod: string, variable: string, featureId: string): Promise<any[]> {
<<<<<<< HEAD
    const promise = new Promise<any[]>((resolve, reject) =>
        $.getJSON('./assets/configs/sfcWindSample.json', (data: any[]) => resolve(data))
    );
=======
    const promise = new Promise<any[]>((resolve, reject) => {
        $.getJSON('./assets/configs/sfcWindSample.json', (data: any[]) => resolve(data));
    });
>>>>>>> add time-slider tests for keypresses and clicks

    return promise;
}

export default <DatasetApi>{
    getData
};
