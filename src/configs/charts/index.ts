export * from './types';

import ahccdGenerator from './ahccd-config-generator';
import cmip5Generator from './cmip5-config-generator';

import { DatasetId } from '@/configs/datasets';
import { AppState } from '@/store';

const chartConfigGenerators = {
    [DatasetId.AHCCD]: ahccdGenerator,
    [DatasetId.CMIP5]: cmip5Generator,

    [DatasetId.CANGRD]: cmip5Generator,
    [DatasetId.DCS]: cmip5Generator
};

/**
 * Returns a chart config generator object given a corresponding dataset id and the state object.
 *
 * @export
 * @param {DatasetId} datasetId
 * @param {AppState} state
 * @returns
 */
export default function(datasetId: DatasetId, state: AppState) {
    return new chartConfigGenerators[datasetId](state);
}
