import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, RCPType, VariableId, DatasetId, IdentifyMode } from '@/types';

const cimp5Dataset: DatasetSource = {
    id: DatasetId.CMIP5,

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

    variables: [
        VariableId.TMean,
        VariableId.Precipitation,
        VariableId.SurfaceWind,
        VariableId.IceConcentration,
        VariableId.IceThickness,
        VariableId.SnowDepth
    ],

    timeSliderLabels: ['2021-2040', '2041-2060', '2061-2080', '2081-2100'],

    /* colourRamp: {
        defaultColours: ['#733E05', '#D6AF67', '#EFF0ED', '#6BBFB1', '#023D32'],
        defaultLabels: ['-100', '100']
    }, */

    // colour ramps are the same for ice thickness and snow depth, so it's set as the default to avoid duplication
    colourRamp: {
        defaultColours: ['#66001F', '#D65F4D', '#FFFFFF', '#4291C2', '#053061'],
        defaultLabels: ['-100', '100'],
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
            },
            [VariableId.TMean]: {
                colours: [
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
                labels: ['-2.5', '13']
            },
            [VariableId.SurfaceWind]: {
                colours: ['#053061', '#4291C2', '#FFFFFF', '#D65F4D', '#66001F'],
                labels: ['-30', '30']
            },
            [VariableId.IceConcentration]: {
                colours: ['#66001F', '#D65F4D', '#FFFFFF', '#4291C2', '#053061'],
                labels: ['-40', '40']
            }
        }
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',

    identifyMode: [IdentifyMode.Query, IdentifyMode.Marker, IdentifyMode.Details]
};

export default cimp5Dataset;
