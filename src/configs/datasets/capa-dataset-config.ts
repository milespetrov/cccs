import { DatasetSource } from './types';
import { VisualizationControlType, VariableId, DatasetId, AnalysisPeriodType } from '@/types';

const capaDataset: DatasetSource = {
    id: DatasetId.CAPA,

    controls: {
        [VisualizationControlType.Analysis]: {
            default: AnalysisPeriodType.Six
        }
    },

    variables: [VariableId.RDPA],

    dateSlider: {
        [AnalysisPeriodType.Six]: {
            range: 7
        },
        [AnalysisPeriodType.TwentyFour]: {
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
