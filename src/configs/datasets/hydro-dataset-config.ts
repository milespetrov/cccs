import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, VariableId, DatasetId } from '@/types';

const hydroDataset: DatasetSource = {
    id: DatasetId.Hydrometric,

    controls: {},

    variables: [VariableId.Hydrometric],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default hydroDataset;
