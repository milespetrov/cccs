import { DatasetApi } from './types';
import { getJSON } from './util';
import { DatasetId } from '@/types';

export interface AhccdApi extends DatasetApi {
    getTrend: (
        options: { variable: string; timePeriod: string; featureId: string; startYear: number; endYear: number }
    ) => any;
}

const BASE_API_URL = 'http://ahccd-dev.azurewebsites.net';

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

async function getData(timePeriod: string, variable: string, featureId: string): Promise<any[]> {
    const fetchUrl = `${BASE_API_URL}/${featureId}/${variable}/${periodMappings[timePeriod]}`;
    const data = await getJSON<any[]>(fetchUrl, DatasetId.AHCCD, 'getData');

    return data;
}

async function getTrend(options: {
    variable: string;
    timePeriod: string;
    featureId: string;
    startYear: number;
    endYear: number;
}) {
    const fetchUrl = `${BASE_API_URL}/${options.featureId}/${options.variable}/${
        periodMappings[options.timePeriod]
    }/trend/${options.startYear}/${options.endYear}`;
    const data = await getJSON<any[]>(fetchUrl, DatasetId.AHCCD, 'getData');

    return data;
}

export default <AhccdApi>{
    getData,
    getTrend
};
