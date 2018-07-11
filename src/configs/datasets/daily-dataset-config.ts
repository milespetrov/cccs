import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, RCPType, VariableId, DatasetId, ViewType } from '@/types';

const dailyDataset: DatasetSource = {
    id: DatasetId.ClimateDaily,

    controls: {},

    variables: [VariableId.ClimateStations],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default dailyDataset;
