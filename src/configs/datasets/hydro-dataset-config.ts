import { DatasetSource } from './types';
import { VariableId, DatasetId, IdentifyMode, DatasetFilter } from '@/types';

const hydroDataset: DatasetSource = {
    id: DatasetId.Hydrometric,

    controls: {},

    filters: [
        DatasetFilter.Stations,
        DatasetFilter.Historical
    ],

    variables: [VariableId.Hydrometric],

    legend: {
        [VariableId.Hydrometric]: '<img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">'
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    identifyMode: [
        IdentifyMode.Query,
        IdentifyMode.Marker,
        IdentifyMode.Highlight,
        IdentifyMode.Haze,
        IdentifyMode.Details
    ]
};

export default hydroDataset;
