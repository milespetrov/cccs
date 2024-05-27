import { VisualizationControlType } from '@/types';

export * from './types';
export * from './dataset-selector-config';
export * from './rcp-selector-config';
export * from './ssp-selector-config';
export * from './timeperiod-selector-config';
export * from './variable-selector-config';
export * from './analysisperiod-selector-config';
export * from './month-selector-config';
export * from './day-selector-config';

export const defaultSelectors = [VisualizationControlType.Dataset, VisualizationControlType.Variable];
