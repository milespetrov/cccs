import { DatasetSource, VariableId, DatasetId } from './types';
import { VisualizationControlType, TimePeriodType, VariableStageType, RCPType } from './../selectors/types';
import { ViewType } from '../../store';

const ahccdDataset: DatasetSource = {
    id: DatasetId.AHCCD,

    [ViewType.ChartView]: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual,
            options: [TimePeriodType.Annual, TimePeriodType.Winter, TimePeriodType.Spring]
        }
    },
    [ViewType.MapView]: {},

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
