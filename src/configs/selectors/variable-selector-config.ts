import { VariableId, DatasetId } from '@/types';
import { VariableSelectorConfig } from './types';

export const variableSelectorConfig: VariableSelectorConfig = {
    groups: [
        {
            id: 'temperature_group',
            items: [VariableId.TMean, VariableId.TMin, VariableId.TMax]
        },
        {
            id: 'wind_group',
            items: [VariableId.SurfaceWind]
        },
        {
            id: 'precipitation_group',
            items: [VariableId.Precipitation]
        },
        {
            id: 'ice_group',
            items: [VariableId.IceConcentration, VariableId.IceThickness]
        },
        {
            id: 'snow_depth_group',
            items: [VariableId.SnowDepth]
        }
    ]
};
