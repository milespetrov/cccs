import { DatasetSource, VariableId, DatasetId } from './types';
import { VisualizationControlType, TimePeriodType, VariableStageType, RCPType } from './../selectors/types';
import { ViewType } from '../../store';

const cimp5Dataset: DatasetSource = {
    id: DatasetId.CMIP5,

    [ViewType.ChartView]: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual,
            options: [TimePeriodType.Winter, TimePeriodType.Spring]
        },
        [VisualizationControlType.RCP]: {
            default: RCPType.RCP2_6
        }
    },
    [ViewType.MapView]: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual,
            options: [TimePeriodType.Winter, TimePeriodType.Spring]
        },
        [VisualizationControlType.RCP]: {
            default: RCPType.RCP2_6,
            options: [RCPType.RCP2_6]
        }
    },

    variables: [VariableId.SurfaceWind],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default cimp5Dataset;
