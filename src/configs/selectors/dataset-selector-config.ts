import { DatasetSelectorConfig } from './types';
import { DatasetId } from '@/types';

export const datasetSelectorConfig: DatasetSelectorConfig = {
    groups: [
        {
            id: 'future_projections',
            showHeader: true,
            items: [DatasetId.CMIP5, DatasetId.CMIP6, DatasetId.DCS, DatasetId.DCSu6] // , DatasetId.SPEI
        },
        {
            id: 'historical_changes',
            showHeader: true,
            items: [DatasetId.AHCCD, DatasetId.CANGRD, DatasetId.CAPA]
        },
        {
            id: 'historical_other',
            showHeader: true,
            items: [DatasetId.ClimateNormal, DatasetId.LTCE, DatasetId.Hydrometric]
        }
    ]
};
