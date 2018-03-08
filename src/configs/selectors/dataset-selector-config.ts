import { DatasetId } from './../datasets/types';
import { DatasetSelectorConfig } from './types';

export const datasetSelectorConfig: DatasetSelectorConfig = {
    groups: [
        {
            id: 'point_datasets',
            items: [DatasetId.AHCCD]
        },
        {
            id: 'polygon_datasets',
            items: [DatasetId.CMIP5, DatasetId.CANGRD, DatasetId.DCS]
        }
    ]
};
