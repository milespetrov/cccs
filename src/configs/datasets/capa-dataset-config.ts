import { DatasetSource } from './types';
import { VariableId, DatasetId } from '@/types';

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
        defaultLabels: ['0.1', '200']
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    queryToolRoute: {
        en: '/regional-deterministic-precipitation-analysis',
        fr: '/analyse-regionale-deterministe-precipitation'
    }
};

export default capaDataset;
