export * from './types';
import ahccd from './ahccd-dataset-config';
import cmip5 from './cmip5-dataset-config';
import cmip6 from './cmip6-dataset-config';
import capa from './capa-dataset-config';
import canGrd from './cangrd-dataset-config';
import dcs from './dcs-dataset-config';
import dcsu6 from './dcsu6-dataset-config';
import normal from './normal-dataset-config';
import hydro from './hydro-dataset-config';
import ltce from './ltce-dataset-config';
import spei from './spei-dataset-config';

import { DatasetId } from '@/types';

export const datasets = {
    [DatasetId.AHCCD]: ahccd,
    [DatasetId.CMIP5]: cmip5,
    [DatasetId.CMIP6]: cmip6,
    [DatasetId.CAPA]: capa,
    [DatasetId.CANGRD]: canGrd,
    [DatasetId.DCS]: dcs,
    [DatasetId.DCSu6]: dcsu6,
    [DatasetId.ClimateNormal]: normal,
    [DatasetId.Hydrometric]: hydro,
    [DatasetId.LTCE]: ltce,
    [DatasetId.SPEI]: spei
};
