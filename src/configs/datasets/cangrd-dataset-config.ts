import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, VariableId, DatasetId } from '@/types';

const canGrdDataset: DatasetSource = {
    id: DatasetId.CANGRD,

    controls: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual
        }
    },

    variables: [VariableId.TMax, VariableId.TMean, VariableId.TMin, VariableId.Precipitation],

    colourRamp: {
        defaultColours: ['#733E05', '#D6AF67', '#EFF0ED', '#6BBFB1', '#023D32'],
        defaultLabels: ['-100', '100']
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default canGrdDataset;
