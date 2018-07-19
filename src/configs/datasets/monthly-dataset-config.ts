import { DatasetSource } from './types';
import { VariableId, DatasetId } from '@/types';

const monthlyDataset: DatasetSource = {
    id: DatasetId.ClimateMonthly,

    controls: {},

    variables: [VariableId.ClimateStations],

    legend: {
        [VariableId.ClimateStations]:
            'Station <img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">'
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default monthlyDataset;
