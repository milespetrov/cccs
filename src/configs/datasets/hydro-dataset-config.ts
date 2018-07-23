import { DatasetSource } from './types';
import { VariableId, DatasetId } from '@/types';

const hydroDataset: DatasetSource = {
    id: DatasetId.Hydrometric,

    controls: {},

    variables: [VariableId.Hydrometric],

    /* legend: {
        [VariableId.Hydrometric]:
            'Station <img src="assets/images/green-circle.svg" style="width: 14px; height: 14px;">'
    }, */

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default hydroDataset;
