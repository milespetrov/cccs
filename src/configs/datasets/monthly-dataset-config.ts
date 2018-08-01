import { DatasetSource } from './types';
import { VariableId, DatasetId } from '@/types';

const monthlyDataset: DatasetSource = {
    id: DatasetId.ClimateMonthly,

    controls: {},

    variables: [VariableId.ClimateStations],

    legend: {
        [VariableId.ClimateStations]: '<img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">'
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    queryToolRoute: {
        en: '/monthly-climate-summaries',
        fr: '/sommaires-climatiques-mensuels'
    }
};

export default monthlyDataset;
