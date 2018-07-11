import { EnhancedWindow } from './types';
import datasets from './datasets';

export * from './types';

const $: any = (<EnhancedWindow>window).$;
const RZ: any = (<EnhancedWindow>window).RZ;

export default {
    $,
    RZ
};

export { datasets as datasetApis };
