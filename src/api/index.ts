import ahccdApi from './ahccd-api';
import cmip5Api from './cmip5-api';
import dcsApi from './dcs-api';
import cangrdApi from './cangrd-api';
import canSIPSApi from './cansips-api';
import capaApi from './capa-api';
import dailyApi from './daily-api';
import monthlyApi from './monthly-api';
import normalApi from './normal-api';
import hydroApi from './hydro-api';

import { EnhancedWindow } from './types';
import { DatasetId } from '@/types';

export * from './types';

const $: any = (<EnhancedWindow>window).$;
const RZ: any = (<EnhancedWindow>window).RZ;

export default {
    $,
    RZ
};

export const datasetApis = {
    [DatasetId.AHCCD]: ahccdApi,
    [DatasetId.CMIP5]: cmip5Api,
    [DatasetId.DCS]: dcsApi,
    [DatasetId.CANGRD]: cangrdApi,
    [DatasetId.CanSIPS]: canSIPSApi,
    [DatasetId.CAPA]: capaApi,
    [DatasetId.ClimateDaily]: dailyApi,
    [DatasetId.ClimateMonthly]: monthlyApi,
    [DatasetId.ClimateNormal]: normalApi,
    [DatasetId.Hydrometric]: hydroApi
};
