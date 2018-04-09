import { RCPSelectorConfig } from './types';
import { RCPType } from '@/types';

export const rcpSelectorConfig: RCPSelectorConfig = {
    groups: [
        {
            id: 'all_rcp_models',
            items: [RCPType.RCP2_6, RCPType.RCP4_5, RCPType.RCP8_5],
            showHeader: false
        }
    ]
};
