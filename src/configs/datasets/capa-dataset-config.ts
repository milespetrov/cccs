import { DatasetSource } from './types';
import { VariableId, DatasetId, IdentifyMode, DatasetFilter } from '@/types';

const capaDataset: DatasetSource = {
    id: DatasetId.CAPA,

    controls: {},

    filters: [
        DatasetFilter.Precipitation,
        DatasetFilter.Historical
    ],

    variables: [VariableId.RDPA6, VariableId.RDPA24],

    dateSlider: {
        [VariableId.RDPA6]: {
            range: 7
        },
        [VariableId.RDPA24]: {
            range: 30
        }
    },

    colourRamp: {
        defaultColours: [
            ['#c4daff', '0'],
            ['#afd2ff', '1'],
            ['#93bcff', '2.5'],
            ['#5898ff', '5'],
            ['#1aace4', '10'],
            ['#23e6da', '15'],
            ['#2de3d0', '20'],
            ['#43ffbb', '25'],
            ['#86ff78', '30'],
            ['#ffff00', '35'],
            ['#ffd700', '40'],
            ['#ff3f00', '45'],
            ['#f00000', '50'],
            ['#c50000', '60'],
            ['#7f0000', '75'],
            ['#000000', '100']
        ],
        defaultLabels: ['0.1', '200'],
        defaultTicks: [
            ['10','5'],
            ['30', '15'],
            ['50', '25'],
            ['70', '35'],
            ['90', '45'],
            ['120', '60'],
            ['150', '75']
        ]
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',

    identifyMode: [IdentifyMode.Query, IdentifyMode.Marker, IdentifyMode.Details]
};

export default capaDataset;
