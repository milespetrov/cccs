import registerAHCCD from './ahccd';
import registerCANGRD from './cangrd';
import registerCAPA from './capa';
import registerCMIP5 from './cmip5';
import registerCMIP6  from './cmip6';
import registerDCS from './dcs';
import registerDCSu6 from './dcs_u6';
import registerHydro from './hydro';
import registerLTCE from './ltce';
import registerNormal from './normal';
import registerSPEI from './spei';

import { DatasetId } from '@/types';

const registerFunctions = {
    [DatasetId.AHCCD]: registerAHCCD,
    [DatasetId.CANGRD]: registerCANGRD,
    [DatasetId.CAPA]: registerCAPA,
    [DatasetId.CMIP5]: registerCMIP5,
    [DatasetId.CMIP6]: registerCMIP6,
    [DatasetId.DCS]: registerDCS,
    [DatasetId.DCSu6]: registerDCSu6,
    [DatasetId.Hydrometric]: registerHydro,
    [DatasetId.LTCE]: registerLTCE,
    [DatasetId.ClimateNormal]: registerNormal,
    [DatasetId.SPEI]: registerSPEI
}

export default function registerDetailsTemplates(rampInstance: any, datasetId: DatasetId): void {
    registerFunctions[datasetId](rampInstance);
}