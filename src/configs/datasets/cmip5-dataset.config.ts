import { DatasetSource, VariableId, DatasetId } from './types';
import { VisualizationControlType, TimePeriodType, StageType, RCPType } from './../selectors/types';
import { ViewType } from '../../store';

const cimp5Dataset: DatasetSource = {
    id: DatasetId.CMIP5,

    views: {
        [ViewType.ChartView]: {
            controls: {
                [VisualizationControlType.Time]: {
                    default: TimePeriodType.Annual,
                    options: [
                        TimePeriodType.Annual,
                        TimePeriodType.Autumn,
                        TimePeriodType.Summer,
                        TimePeriodType.Winter,
                        TimePeriodType.Spring
                    ]
                },
                [VisualizationControlType.RCP]: {
                    default: RCPType.RCP2_6
                }
            }
        },
        [ViewType.MapView]: {
            controls: {
                [VisualizationControlType.Time]: {
                    default: TimePeriodType.Annual,
                    options: [TimePeriodType.Winter, TimePeriodType.Spring]
                },
                [VisualizationControlType.RCP]: {
                    default: RCPType.RCP8_5
                }
            }
        }
    },

    variables: [VariableId.SurfaceWind],

    timeSliderLabels: ['2021-2040', '2041-2060', '2061-2080', '2081-2100'],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default cimp5Dataset;
