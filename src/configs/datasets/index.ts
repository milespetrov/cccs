export * from './types';
import ahccd from './ahccd-dataset-config';
import cmip5 from './cmip5-dataset-config';
import canSips from './cansips-dataset-config';
import capa from './capa-dataset-config';
import canGrd from './cangrd-dataset-config';
import dcs from './dcs-dataset-config';
import daily from './daily-dataset-config';
import monthly from './monthly-dataset-config';
import normal from './normal-dataset-config';
import hydro from './hydro-dataset-config';

import { DatasetId } from '@/types';

export const datasets = {
    [DatasetId.AHCCD]: ahccd,
    [DatasetId.CMIP5]: cmip5,
    [DatasetId.CanSIPS]: canSips,
    [DatasetId.CAPA]: capa,
    [DatasetId.CANGRD]: canGrd,
    [DatasetId.DCS]: dcs,
    [DatasetId.ClimateDaily]: daily,
    [DatasetId.ClimateMonthly]: monthly,
    [DatasetId.ClimateNormal]: normal,
    [DatasetId.Hydrometric]: hydro
};
