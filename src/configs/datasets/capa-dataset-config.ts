import { DatasetSource } from './types';
import { VisualizationControlType, VariableId, DatasetId, AnalysisPeriodType } from '@/types';

const capaDataset: DatasetSource = {
    id: DatasetId.CAPA,

    controls: {},

    variables: [VariableId.RDPA6, VariableId.RDPA24],

    dateSlider: {
        [VariableId.RDPA6]: {
            range: 7
        },
        [VariableId.RDPA24]: {
            range: 30
        }
    },

    /*     legend: {}, */

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    queryToolRoute: {
        en: '/regional-deterministic-precipitation-analysis',
        fr: '/analyse-regionale-deterministe-precipitation'
    }
};

export default capaDataset;
