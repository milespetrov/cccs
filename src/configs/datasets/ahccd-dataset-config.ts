import { DatasetSource, VariableId, DatasetId } from './types';
import { VisualizationControlType, TimePeriodType, VariableStageType } from './../selectors/types';

const ahccdDataset: DatasetSource = {
    id: DatasetId.AHCCD,

    chartView: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual,
            options: [TimePeriodType.Annual, TimePeriodType.Winter, TimePeriodType.Spring]
        }
    },
    mapView: {},

    variables: [
        {
            id: VariableId.TMax,
            stage: VariableStageType.Historic
        },
        {
            id: VariableId.TMean,
            stage: VariableStageType.Historic
        }
    ],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default ahccdDataset;
