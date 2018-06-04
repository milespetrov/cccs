import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, RCPType, VariableId, DatasetId, ViewType } from '@/types';

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

    variables: [VariableId.SurfaceWind, VariableId.IceConcentration, VariableId.IceThickness, VariableId.SnowDepth],

    timeSliderLabels: ['2021-2040', '2041-2060', '2061-2080', '2081-2100'],

    colourRamp: {
        defaultColours: ['#733E05', '#D6AF67', '#EFF0ED', '#6BBFB1', '#023D32'],
        defaultLabels: ['-100', '100'],
        variables: {
            [VariableId.IceConcentration]: {
                labels: ['-40', '40']
            },
            [VariableId.SurfaceWind]: {
                labels: ['-30', '30']
            }
        }
    },

    mapTableColumns: ['Longitude', 'Latitude', 'Value'],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default cimp5Dataset;
