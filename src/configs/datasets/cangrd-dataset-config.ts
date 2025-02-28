import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, VariableId, DatasetId, IdentifyMode, DatasetFilter } from '@/types';

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

    filters: [
        DatasetFilter.Temperature,
        DatasetFilter.Precipitation,
        DatasetFilter.Historical,
        DatasetFilter.Gridded
    ],

    variables: [VariableId.TMean, VariableId.Precipitation],

    colourRamp: {
        defaultColours: [
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
        defaultLabels: ['-2', '13'],
        defaultTicks: [
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
                labels: ['-100', '100'],
                ticks: [
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
                ]
            }
        }
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',

    identifyMode: [IdentifyMode.Query, IdentifyMode.Marker, IdentifyMode.Details]
};

export default canGrdDataset;
