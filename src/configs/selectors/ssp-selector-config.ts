import { SSPSelectorConfig } from './types';
import { SSPType } from '@/types';

export const sspSelectorConfig: SSPSelectorConfig = {
    groups: [
        {
            id: 'all_ssp_models',
            items: [SSPType.SSP126, SSPType.SSP245, SSPType.SSP370, SSPType.SSP585],
            showHeader: false
        }
    ]
};
