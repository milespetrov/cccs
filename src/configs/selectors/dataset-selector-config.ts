import { DatasetSelectorConfig } from './types';
import { DatasetId } from '@/types';

export const datasetSelectorConfig: DatasetSelectorConfig = {
    groups: [
        {
            id: 'all_datasets',
            items: [
                DatasetId.AHCCD,
                DatasetId.CANGRD,
                DatasetId.CMIP5,
                DatasetId.DCS,
                DatasetId.ClimateNormal,
                DatasetId.ClimateMonthly,
                DatasetId.ClimateDaily,
                DatasetId.CAPA,
                DatasetId.Hydrometric
            ],
            showHeader: false
        }
    ]
};
