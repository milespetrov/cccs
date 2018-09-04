import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, DatasetId, VariableId, IdentifyMode } from '@/types';

const ahccdDataset: DatasetSource = {
    id: DatasetId.AHCCD,
    controls: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual,
            disableOn: [VariableId.ClimateStations]
        }
    },

    variables: [
        VariableId.TMax,
        VariableId.TMean,
        VariableId.TMin,
        VariableId.Precipitation,
        VariableId.StationPressure,
        VariableId.SeaLevelPressure,
        VariableId.SurfaceWind,
        VariableId.ClimateStations
    ],

    legend: {
        [VariableId.TMax]: '<img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.TMean]: '<img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.TMin]: '<img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.Precipitation]: '<img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.StationPressure]: '<img src="assets/images/green-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.SeaLevelPressure]: '<img src="assets/images/green-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.ClimateStations]: '<img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.SurfaceWind]: '<img src="assets/images/green-circle.svg" style="width: 14px; height: 14px;">'
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    queryToolRoute: {
        en: '/adjusted-station-data',
        fr: '/donnees-climatiques-ajustees'
    },

    identifyMode: [
        IdentifyMode.Query,
        IdentifyMode.Marker,
        IdentifyMode.Highlight,
        IdentifyMode.Haze,
        IdentifyMode.Details
    ]
};

export default ahccdDataset;
