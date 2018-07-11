import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, RCPType, VariableId, DatasetId, ViewType } from '@/types';

const normalDataset: DatasetSource = {
    id: DatasetId.ClimateNormal,

    controls: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual,
            disableOn: [VariableId.ClimateStations]
        }
    },

    variables: [
        VariableId.ClimateStations,
        VariableId.TMax,
        VariableId.TMean,
        VariableId.TMin,
        VariableId.Precipitation,
        VariableId.StationPressure,
        VariableId.SeaLevelPressure,
        VariableId.SurfaceWind,
        VariableId.GustSpeed,
        VariableId.GustDirection
    ],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default normalDataset;
