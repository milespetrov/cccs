import registerAHCCD from './ahccd';
import registerCANGRD from './cangrd';
import registerCAPA from './capa';
import registerCMIP5 from './cmip5';
import registerDCS from './dcs';
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
    [DatasetId.DCS]: registerDCS,
    [DatasetId.DCSu6]: () => {},
    [DatasetId.Hydrometric]: registerHydro,
    [DatasetId.LTCE]: registerLTCE,
    [DatasetId.ClimateNormal]: registerNormal,
    [DatasetId.SPEI]: registerSPEI
}

export default function registerDetailsTemplates(rampInstance: any, datasetId: DatasetId): void {
    if (datasetId === "cmip6") {
        return;
    }
    registerFunctions[datasetId](rampInstance);
}