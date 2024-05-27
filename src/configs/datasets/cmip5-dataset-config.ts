import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, RCPType, VariableId, DatasetId, IdentifyMode } from '@/types';

const cmip5Dataset: DatasetSource = {
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
        defaultTicks: [
            //['-90', '5'],
            ['-80', '10'],
            //['-70', '15'],
            ['-60', '20'],
            //['-50', '25'],
            ['-40', '30'],
            //['-30', '35'],
            ['-20', '40'],
            //['-10', '45'],
            ['0', '50'],
            //['10', '55'],
            ['20', '60'],
            //['30', '65'],
            ['40', '70'],
            //['50', '75'],
            ['60', '80'],
            //['70', '85'],
            ['80', '90'],
            //['90', '95']
        ],
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
                    '#0a2864',
                    '#3366d9',
                    '#698aec',
                    '#97b4fa',
                    '#fcf8e9',
                    '#f7edc6',
                    '#ffdc91',
                    '#ffce6d',
                    '#ffc151',
                    '#ffb535',
                    '#ffa333',
                    '#ff9133',
                    '#ff7d25',
                    '#ff6711',
                    '#fd5201',
                    '#f4420c',
                    '#eb3217',
                    '#e1231a',
                    '#d41510',
                    '#c70806',
                    '#b90000',
                    '#a90000',
                    '#990000',
                    '#8a0000',
                    '#810000',
                    '#780000',
                    '#6e0000',
                    '#6c000d',
                    '#6c0020',
                    '#6d0032',
                    '#6d0044'
                ],
                labels: ['-2', '13'],
                ticks: [
                    //['-1', '6.66'],
                    ['0', '13.32'],
                    //['1', '19.98'],
                    ['2', '26.64'],
                    //['3', '33.3'],
                    ['4', '39.96'],
                    //['5', '46.62'],
                    ['6', '53.28'],
                    //['7', '59.94'],
                    ['8', '66.6'],
                    //['9', '73.26'],
                    ['10', '79.92'],
                    //['11', '86.58'],
                    ['12', '93.24']
                ]
            },
            [VariableId.SurfaceWind]: {
                colours: ['#053061', '#4291C2', '#FFFFFF', '#D65F4D', '#66001F'],
                labels: ['-30', '30'],
                ticks: [
                    ['-20', '16.67'],
                    ['-10', '33.33'],
                    ['0', '50'],
                    ['10', '66.67'],
                    ['20', '83.33']
                ]
            },
            [VariableId.IceConcentration]: {
                colours: ['#66001F', '#D65F4D', '#FFFFFF', '#4291C2', '#053061'],
                labels: ['-40', '40'],
                ticks: [
                    ['-30', '12.5'],
                    ['-20', '25'],
                    ['-10', '37.5'],
                    ['0', '50'],
                    ['10', '62.5'],
                    ['20', '75'],
                    ['30', '87.5']
                ]
            }
        }
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',

    identifyMode: [IdentifyMode.Query, IdentifyMode.Marker, IdentifyMode.Details]
};

export default cmip5Dataset;
