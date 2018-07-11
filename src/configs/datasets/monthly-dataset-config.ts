import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, VariableId, DatasetId } from '@/types';

const monthlyDataset: DatasetSource = {
    id: DatasetId.ClimateMonthly,

    controls: {},

    variables: [VariableId.ClimateStations],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default monthlyDataset;
