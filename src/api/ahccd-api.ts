import { DatasetApi } from './types';
import { getJSON } from './util';
import { DatasetId } from '@/types';
import { AppState } from '@/store';
import mappings from '@/globals/mappings';
import ahccdDataset from '@/configs/datasets/ahccd-dataset-config';

const BASE_API_URL = 'http://ahccd-dev.azurewebsites.net';
const BASE_MAP_URL = './assets/configs/AHCCD';

/**
 * @class AHCCDApi
 *
 * @method getData returns data for the current feature/variable
 * @method getTrend returns the trend value for the current feature/variable for the specified start and end years
 */
class AHCCDApi extends DatasetApi {
    /**
     * Returns the chart data for the current feature and variable
     */
    async getData(): Promise<any> {
        const fetchUrl = `${BASE_API_URL}/${this.state.featureId}/${this.state.variableId}/${
            mappings.periodToNum[this.state.timePeriodId!]
        }`;
        const data = await getJSON<any>(fetchUrl, DatasetId.AHCCD, 'getData');

        return data;
    }

    /**
     * Returns the trend value for the period beginning at startYear and ending at endYear.
     * The trend is for the current feature and variable
     *
     * @param startYear the beginning year for the trend calculation
     * @param endYear the end year for the trend calculation
     */
    async getTrend(startYear: number, endYear: number): Promise<any> {
        const fetchUrl = `${BASE_API_URL}/${this.state.featureId}/${this.state.variableId}/${
            mappings.periodToNum[this.state.timePeriodId!]
        }/trend/${startYear}/${endYear}`;
        const data = await getJSON<any>(fetchUrl, DatasetId.AHCCD, 'getData');

        return data;
    }

    /**
     * Returns an array of data layers for the current state.
     *
     * @param configVersion version grabbed from the config storage
     */
    async getDataLayers(configVersion: string): Promise<any[]> {
        const fetchUrl = `${BASE_MAP_URL}/${configVersion}/layer-configs.json`;
        const result = await $.getJSON(fetchUrl);

        return result[this.state.variableId!];
    }

    /**
     * AHCCD has no reference layers (currently), return an empty array
     */
    getReferenceLayers() {
        return [];
    }

    /**
     * Returns an array of rows for a datatable.
     */
    async getTableData() {
        enum columns {
            'Station Name' = 'station_name_nom',
            'Station ID' = 'stnid',
            'Beginning Year' = 'beg_yr_annee_deb',
            'Beginning Month' = 'beg_mon_mois_deb',
            'Ending Year' = 'end_yr_annee_fin',
            'Ending Month' = 'end_mon_mois_fin',
            'Value' = 'Annual_Annuel'
        }
        const varArray: any = {
            precip: 3,
            tmean: 0,
            tmax: 2,
            tmin: 1
        };

        const tempData: any = await $.getJSON(
            `http://cipgis.canadaeast.cloudapp.azure.com/arcgis/rest/services/AHCCD/AHCCD_en/MapServer/${
                varArray[this.state.variableId!]
            }/query?where=1%3D1&outFields=*&returnGeometry=false&f=json`,
            data => {
                return data;
            }
        );
        const tableData: any[] = [];

        tempData.features.forEach((feature: any) => {
            const row: any[] = [];
            ahccdDataset.mapTableColumns.forEach((column: string) => {
                row.push(feature.attributes[columns[<any>column]]);
            });
            tableData.push(row);
        });

        console.log(tableData);

        return tableData;
    }
}

export default function(state: AppState) {
    return new AHCCDApi(state);
}
