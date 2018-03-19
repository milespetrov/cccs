import ahccdApi from './ahccd-api';
import cmip5Api from './cmip5-api';
import { EnhancedWindow } from './types';

const DQV: any = (<EnhancedWindow>window).DQV;
const $: any = (<EnhancedWindow>window).$;
const RZ: any = (<EnhancedWindow>window).RZ;

export default {
    DQV,
    $,
    RZ
};

export { ahccdApi, cmip5Api };
