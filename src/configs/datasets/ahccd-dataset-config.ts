import { DatasetSource, VariableId, DatasetId } from './types';
import { VisualizationControlType, TimePeriodType, StageType, RCPType } from './../selectors/types';
import { ViewType } from '../../store';

const ahccdDataset: DatasetSource = {
    id: DatasetId.AHCCD,
    views: {
        [ViewType.ChartView]: {
            controls: {
                [VisualizationControlType.Time]: {
                    default: TimePeriodType.January
                }
            }
        },
        [ViewType.MapView]: {
            controls: {
                [VisualizationControlType.Time]: {
                    visible: false,
                    default: TimePeriodType.Annual,
                    options: [TimePeriodType.Annual]
                }
            }
        }
    },

    variables: [VariableId.TMax, VariableId.TMean, VariableId.TMin, VariableId.Precipitation],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default ahccdDataset;
