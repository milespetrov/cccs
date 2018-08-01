import { DatasetSource } from './types';
import { VariableId, DatasetId } from '@/types';

const dailyDataset: DatasetSource = {
    id: DatasetId.ClimateDaily,

    controls: {},

    variables: [VariableId.ClimateStations],

    legend: {
        [VariableId.ClimateStations]: '<img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">'
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    queryToolRoute: {
        en: '/daily-climate-data',
        fr: '/donnees-climatiques-quotidennes'
    }
};

export default dailyDataset;
