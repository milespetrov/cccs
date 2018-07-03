import ahccdApi from './ahccd-api';
import cmip5Api from './cmip5-api';
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

    [DatasetId.CANGRD]: cmip5Api,
    [DatasetId.DCS]: cmip5Api
};
