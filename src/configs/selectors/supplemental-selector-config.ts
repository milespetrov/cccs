import { SupplementalLayers, SupplementalSelectorConfig } from './types';
import { SupplementalId } from '@/types';

export const supplementalSelectorConfig: SupplementalSelectorConfig = {
    id: 'supplementalSelector',
    items: [SupplementalId.NP, SupplementalId.NTSN, SupplementalId.CDD, SupplementalId.ATRIS]
};
