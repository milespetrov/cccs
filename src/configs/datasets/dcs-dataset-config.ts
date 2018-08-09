import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, RCPType, VariableId, DatasetId } from '@/types';

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

    // colour ramps are the same for all temperature variables, so it's set as the default to avoid duplication
    colourRamp: {
        defaultColours: [
            '#0A2863',
            '#688AED',
            '#CCD9FF',
            '#FFE19C',
            '#FFC966',
            '#FFB73B',
            '#FF9C33',
            '#FF8229',
            '#FF600A',
            '#F5450A',
            '#E82D1C',
            '#D61811',
            '#C20202',
            '#AB0000',
            '#940000',
            '#820000',
            '#730000',
            '#6B000B',
            '#6E0028',
            '#6E0045'
        ],
        defaultLabels: ['-2.5', '13'],
        variables: {
            [VariableId.Precipitation]: {
                colours: [
                    '#B0692A',
                    '#BA7232',
                    '#C27C3A',
                    '#CC8645',
                    '#D69656',
                    '#E0A867',
                    '#E8B976',
                    '#F2CA71',
                    '#F5D795',
                    '#F7E5A8',
                    '#EBFAC0',
                    '#B8F5BA',
                    '#6DC9A9',
                    '#6AB3BD',
                    '#619FBA',
                    '#5890B0',
                    '#467C9E',
                    '#32688A',
                    '#245678',
                    '#1B4869',
                    '#133A59'
                ],
                labels: ['-100', '100']
            }
        }
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    queryToolRoute: {
        en: '/downscaled-data',
        fr: '/donnees-echelle-reduite'
    }
};

export default dcsDataset;
