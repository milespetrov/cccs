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
                    default: RCPType.RCP8_5
                }
            }
        },
        [ViewType.MapView]: {
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
                    default: RCPType.RCP8_5
                }
            }
        }
    },

    variables: [VariableId.SurfaceWind, VariableId.IceFraction, VariableId.IceThickness, VariableId.SnowDepth],

    timeSliderLabels: ['2021-2040', '2041-2060', '2061-2080', '2081-2100'],

    colourRamp: {
        defaultColours: [
            '#67001f',
            '#b2182b',
            '#d6604d',
            '#f4a582',
            '#fddbc7',
            '#f7f7f7',
            '#d1e5f0',
            '#92c5de',
            '#4393c3',
            '#2166ac',
            '#053061'
        ],
        defaultLabels: ['-100', '100'],
        variables: {
            [VariableId.IceFraction]: {
                labels: ['-40', '40']
            },
            [VariableId.SurfaceWind]: {
                labels: ['-30', '30']
            }
        }
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default cimp5Dataset;
