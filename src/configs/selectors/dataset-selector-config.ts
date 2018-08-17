import { DatasetSelectorConfig } from './types';
import { DatasetId } from '@/types';

export const datasetSelectorConfig: DatasetSelectorConfig = {
    groups: [
        {
            id: 'future_projections',
            items: [DatasetId.CMIP5, DatasetId.DCS]
        },
        {
            id: 'historical_stations',
            items: [
                DatasetId.ClimateNormal,
                DatasetId.ClimateMonthly,
                DatasetId.ClimateDaily,
                DatasetId.Hydrometric,
                DatasetId.AHCCD
            ]
        },
        {
            id: 'historical_grids',
            items: [DatasetId.CANGRD, DatasetId.CAPA]
        }
    ]
};
