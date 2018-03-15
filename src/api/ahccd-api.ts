import { DatasetApi } from './types';

interface AhccdApi extends DatasetApi {
    getTrend: (variable: string, timePeriod: string, featureId: string, startYear: number, endYear: number) => any;
}

const periodMappings: { [key: string]: number } = {
    Jan_Janv: 1,
    Feb_Fev: 2,
    Mar_March: 3,
    Apr_Avr: 4,
    May_Mai: 5,
    June_Juin: 6,
    July_Juil: 7,
    Aug_Aout: 8,
    Sept_Sept: 9,
    Oct_Oct: 10,
    Nov_Nov: 11,
    Dec_Dec: 12,
    Winter_Hiver: 13,
    Spring_Printemp: 14,
    Summer_Ete: 15,
    Autumn_Autome: 16,
    Annual_Annuel: 17
};

function getData(timePeriod: string, variable: string, featureId: string): Promise<any[]> {
    const promise = new Promise<any[]>((resolve, reject) => {
        $.getJSON(
            `http://ahccd-dev.azurewebsites.net/${featureId}/${variable}/${periodMappings[timePeriod]}`,
            (data: any[]) => resolve(data)
        );
    });

    return promise;
}

function getTrend(variable: string, timePeriod: string, featureId: string, startYear: number, endYear: number) {
    return $.getJSON(
        `http://ahccd-dev.azurewebsites.net/${featureId}/${variable}/${
            periodMappings[timePeriod]
        }/trend/${startYear}/${endYear}`,
        data => data
    );
}

export default <AhccdApi>{
    getData,
    getTrend
};
