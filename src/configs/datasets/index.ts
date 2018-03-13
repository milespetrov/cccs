export * from './types';
import ahccd from './ahccd-dataset-config';
import cmip5 from './cmip5-dataset.config';

export const datasets = {
    [ahccd.id]: ahccd,
    [cmip5.id]: cmip5
};
