import { DatasetSelectorConfig } from './types';
import { DatasetId } from '@/types';

export const datasetSelectorConfig: DatasetSelectorConfig = {
    groups: [
        {
            id: 'all_datasets',
            items: [DatasetId.AHCCD, DatasetId.CMIP5, DatasetId.CANGRD, DatasetId.DCS],
            showHeader: false
        }
    ]
};
