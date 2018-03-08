import { VariableId } from './../datasets/types';
import { VariableSelectorConfig } from './types';

export const variableSelectorConfig: VariableSelectorConfig = {
    groups: [
        {
            id: 'temp-group',
            items: [VariableId.TMean, VariableId.TMin, VariableId.TMax]
        },
        {
            id: 'wind-speed-group',
            items: [VariableId.SurfaceWind]
        }
    ]
};
