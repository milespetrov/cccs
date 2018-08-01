import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, VariableId, DatasetId } from '@/types';

const canGrdDataset: DatasetSource = {
    id: DatasetId.CANGRD,

    controls: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual,
            options: [
                TimePeriodType.Annual,
                TimePeriodType.Autumn,
                TimePeriodType.Summer,
                TimePeriodType.Winter,
                TimePeriodType.Spring
            ]
        }
    },

    variables: [VariableId.TMean, VariableId.Precipitation],

    /* colourRamp: {
        defaultColours: ['#733E05', '#D6AF67', '#EFF0ED', '#6BBFB1', '#023D32'],
        defaultLabels: ['-100', '100']
    }, */

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    queryToolRoute: {
        en: '/historical-gridded-data',
        fr: '/donnees-maillees-historiques'
    }
};

export default canGrdDataset;
