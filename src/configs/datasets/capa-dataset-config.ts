import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, RCPType, VariableId, DatasetId, ViewType } from '@/types';

const capaDataset: DatasetSource = {
    id: DatasetId.CAPA,

    controls: {},

    variables: [VariableId.HRDPA, VariableId.RDPA],

    legend: {},

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default capaDataset;
