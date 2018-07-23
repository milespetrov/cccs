import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, RCPType, ViewType, DatasetId, VariableId } from '@/types';

const ahccdDataset: DatasetSource = {
    id: DatasetId.AHCCD,
    controls: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual,
            disableOn: [VariableId.ClimateStations]
        }
    },

    variables: [
        VariableId.ClimateStations,
        VariableId.TMean,
        VariableId.TMax,
        VariableId.TMin,
        VariableId.Precipitation,
        VariableId.StationPressure,
        VariableId.SeaLevelPressure,
        VariableId.SurfaceWind
    ],

    /* legend: {
        [VariableId.TMax]: 'Temperature <img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.TMean]: 'Temperature <img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.TMin]: 'Temperature <img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.Precipitation]:
            'Precipitation <img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.StationPressure]:
            'Pressure <img src="assets/images/green-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.SeaLevelPressure]:
            'Pressure <img src="assets/images/green-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.ClimateStations]:
            'Station <img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.SurfaceWind]:
            'Wind Speed <img src="assets/images/green-circle.svg" style="width: 14px; height: 14px;">'
    }, */

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default ahccdDataset;
