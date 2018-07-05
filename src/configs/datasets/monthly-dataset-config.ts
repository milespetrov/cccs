import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, VariableId, DatasetId } from '@/types';

const monthlyDataset: DatasetSource = {
    id: DatasetId.ClimateMonthly,

    controls: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual
        }
    },

    variables: [VariableId.TMax, VariableId.TMean, VariableId.TMin, VariableId.Precipitation],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default monthlyDataset;
