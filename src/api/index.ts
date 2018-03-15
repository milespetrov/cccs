import ahccd from './ahccd-api';
import cmip5 from './cmip5-api';
import { EnhancedWindow } from './types';

const DQV: any = (<EnhancedWindow>window).DQV;
const $: any = (<EnhancedWindow>window).$;
const RZ: any = (<EnhancedWindow>window).RZ;

export default {
    DQV,
    $,
    RZ,
    ahccd,
    cmip5
};
