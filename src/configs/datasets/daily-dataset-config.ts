import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, RCPType, VariableId, DatasetId, ViewType } from '@/types';

const dailyDataset: DatasetSource = {
    id: DatasetId.ClimateDaily,

    controls: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual
        }
    },

    variables: [VariableId.TMax, VariableId.TMean, VariableId.TMin, VariableId.Precipitation],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default dailyDataset;
