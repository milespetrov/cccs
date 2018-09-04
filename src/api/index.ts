import { EnhancedWindow } from './types';
import datasets from './datasets';

export * from './types';

const $: any = (<EnhancedWindow>window).$;
const RZ: any = (<EnhancedWindow>window).RZ;
const dcsMultiTrack: any = (<any>window).dcsMultiTrack;

export default {
    $,
    RZ,
    dcsMultiTrack
};

export { datasets as datasetApis };
