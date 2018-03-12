import { DatasetId } from './../datasets/types';
import { DatasetSelectorConfig } from './types';

export const datasetSelectorConfig: DatasetSelectorConfig = {
    groups: [
        {
            id: 'all_datasets',
            items: [DatasetId.AHCCD, DatasetId.CMIP5, DatasetId.CANGRD, DatasetId.DCS],
            showHeader: false
        }
    ]
};
