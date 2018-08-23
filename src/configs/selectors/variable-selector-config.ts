import { VariableId, DatasetId } from '@/types';
import { VariableSelectorConfig } from './types';

export const variableSelectorConfig: VariableSelectorConfig = {
    groups: [
        {
            id: 'temperature_group',
            items: [VariableId.TMean, VariableId.TMin, VariableId.TMax, VariableId.SurfaceTemp, VariableId.WaterTemp],
            showHeader: true
        },
        {
            id: 'precipitation_group',
            items: [VariableId.Precipitation, VariableId.HRDPA, VariableId.RDPA6, VariableId.RDPA24],
            showHeader: true
        },
        {
            id: 'wind_group',
            items: [
                VariableId.SurfaceWind,
                VariableId.GustDirection,
                VariableId.GustDirection850,
                VariableId.GustSpeed
            ],
            showHeader: true
        },
        {
            id: 'ice_group',
            items: [VariableId.IceConcentration, VariableId.IceThickness],
            showHeader: true
        },
        {
            id: 'snow_depth_group',
            items: [VariableId.SnowDepth],
            showHeader: true
        },
        {
            id: 'pressure_group',
            items: [VariableId.SeaLevelPressure, VariableId.StationPressure],
            showHeader: true
        },
        {
            id: 'hydrometric_group',
            items: [VariableId.Hydrometric]
        },
        {
            id: 'geopotential_group',
            items: [VariableId.Geopotential],
            showHeader: true
        },
        {
            id: 'stations_group',
            items: [VariableId.ClimateStations, VariableId.Monthly, VariableId.Daily],
            showHeader: true
        }
    ]
};
