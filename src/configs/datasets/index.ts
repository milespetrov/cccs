export * from './types';
import ahccd from './ahccd-dataset-config';
import cmip5 from './cmip5-dataset-config';
import capa from './capa-dataset-config';
import canGrd from './cangrd-dataset-config';
import dcs from './dcs-dataset-config';
import normal from './normal-dataset-config';
import hydro from './hydro-dataset-config';
import ltce from './ltce-dataset-config';

import { DatasetId } from '@/types';

export const datasets = {
    [DatasetId.AHCCD]: ahccd,
    [DatasetId.CMIP5]: cmip5,
    [DatasetId.CAPA]: capa,
    [DatasetId.CANGRD]: canGrd,
    [DatasetId.DCS]: dcs,
    [DatasetId.ClimateNormal]: normal,
    [DatasetId.Hydrometric]: hydro,
    [DatasetId.LTCE]: ltce
};
