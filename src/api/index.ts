import { EnhancedWindow } from './types';
import datasets from './datasets';

export * from './types';

const $: any = (<EnhancedWindow>window).$;
const RAMP: any = (<EnhancedWindow>window).RAMP;
const dcsMultiTrack: any =
    (<any>window).dcsMultiTrack ||
    (() => {
        console.warn('dcsMultiTrack is not available, possibly blocked.');
    });

export default {
    $,
    RAMP,
    dcsMultiTrack
};

export { datasets as datasetApis };
