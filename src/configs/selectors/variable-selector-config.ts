import { VariableId, DatasetId } from '@/types';
import { VariableSelectorConfig } from './types';

export const variableSelectorConfig: VariableSelectorConfig = {
    groups: [
        {
            id: 'temperature_group',
            items: [VariableId.TMean, VariableId.TMin, VariableId.TMax],
            showHeader: true
        },
        {
            id: 'wind_group',
            items: [VariableId.SurfaceWind],
            showHeader: true
        },
        {
            id: 'precipitation_group',
            items: [VariableId.Precipitation],
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
        }
    ]
};
