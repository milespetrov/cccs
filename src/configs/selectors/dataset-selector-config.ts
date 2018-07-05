import { DatasetSelectorConfig } from './types';
import { DatasetId } from '@/types';

export const datasetSelectorConfig: DatasetSelectorConfig = {
    groups: [
        {
            id: 'all_datasets',
            items: [
                DatasetId.AHCCD,
                DatasetId.CMIP5,
                DatasetId.CANGRD,
                DatasetId.DCS,
                DatasetId.ClimateNormal,
                DatasetId.ClimateMonthly,
                DatasetId.ClimateDaily,
                //DatasetId.CanSIPS,
                DatasetId.CAPA,
                DatasetId.Hydrometric
            ],
            showHeader: false
        }
    ]
};
