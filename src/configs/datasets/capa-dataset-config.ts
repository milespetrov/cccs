import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, RCPType, VariableId, DatasetId, ViewType } from '@/types';

const capaDataset: DatasetSource = {
    id: DatasetId.CAPA,

    controls: {},

    variables: [VariableId.HRDPA, VariableId.RDPA],

    /*     legend: {}, */

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    queryToolRoute: {
        en: '/regional-deterministic-precipitation-analysis',
        fr: '/analyse-regionale-deterministe-precipitation'
    }
};

export default capaDataset;
