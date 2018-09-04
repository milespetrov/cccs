import { DatasetSource } from './types';
import { VariableId, DatasetId, IdentifyMode } from '@/types';

const hydroDataset: DatasetSource = {
    id: DatasetId.Hydrometric,

    controls: {},

    variables: [VariableId.Hydrometric],

    legend: {
        [VariableId.Hydrometric]: '<img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">'
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    queryToolRoute: {
        en: '/water-quantity-data',
        fr: '/donnees-quantite-eau'
    },
    identifyMode: [
        IdentifyMode.Query,
        IdentifyMode.Marker,
        IdentifyMode.Highlight,
        IdentifyMode.Haze,
        IdentifyMode.Details
    ]
};

export default hydroDataset;
