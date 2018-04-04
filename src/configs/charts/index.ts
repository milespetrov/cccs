export * from './types';

import ahccdGenerator from './ahccd-config-generator';
import cmip5Generator from './cmip5-config-generator';

import { AppState } from '@/store/state';
import { DatasetId } from '@/types';

export const chartConfigGenerators = {
    [DatasetId.AHCCD]: ahccdGenerator,
    [DatasetId.CMIP5]: cmip5Generator,

    [DatasetId.CANGRD]: cmip5Generator,
    [DatasetId.DCS]: cmip5Generator
};
