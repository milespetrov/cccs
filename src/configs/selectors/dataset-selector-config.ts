import { DatasetSelectorConfig } from './types';
import { DatasetId } from '@/types';

export const datasetSelectorConfig: DatasetSelectorConfig = {
    groups: [
        {
            id: 'future_projections',
            items: [DatasetId.CMIP5, DatasetId.DCS]
        },
        {
            id: 'historical_changes',
            items: [DatasetId.AHCCD, DatasetId.CANGRD, DatasetId.CAPA]
        },
        {
            id: 'historical_other',
            items: [DatasetId.ClimateNormal, DatasetId.LTCE, DatasetId.Hydrometric]
        }
    ]
};
