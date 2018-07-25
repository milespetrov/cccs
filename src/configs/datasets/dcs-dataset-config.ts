import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, RCPType, VariableId, DatasetId, ViewType } from '@/types';

const dcsDataset: DatasetSource = {
    id: DatasetId.DCS,

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
        },
        [VisualizationControlType.RCP]: {
            default: RCPType.RCP8_5
        }
    },

    variables: [VariableId.TMax, VariableId.TMean, VariableId.TMin, VariableId.Precipitation],

    timeSliderLabels: ['2021-2040', '2041-2060', '2061-2080', '2081-2100'],

    /*  colourRamp: {
        defaultColours: ['#733E05', '#D6AF67', '#EFF0ED', '#6BBFB1', '#023D32'],
        defaultLabels: ['-100', '100']
    }, */

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default dcsDataset;
