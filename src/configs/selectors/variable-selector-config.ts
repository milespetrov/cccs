import { VariableId, DatasetId, StageType } from '@/types';
import { VariableSelectorConfig, StageMapping } from './types';

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

export const stages: StageMapping = {
    [VariableId.TMean]: {
        [StageType.Historic]: [DatasetId.AHCCD, DatasetId.CANGRD],
        [StageType.Future]: [DatasetId.DCS]
    },
    [VariableId.TMax]: {
        [StageType.Historic]: [DatasetId.AHCCD, DatasetId.CANGRD],
        [StageType.Future]: [DatasetId.DCS]
    },
    [VariableId.TMin]: {
        [StageType.Historic]: [DatasetId.AHCCD, DatasetId.CANGRD],
        [StageType.Future]: [DatasetId.DCS]
    },
    [VariableId.Precipitation]: {
        [StageType.Historic]: [DatasetId.AHCCD, DatasetId.CANGRD],
        [StageType.Future]: [DatasetId.DCS]
    },
    [VariableId.SurfaceWind]: {
        [StageType.Future]: [DatasetId.CMIP5]
    },
    [VariableId.IceConcentration]: {
        [StageType.Future]: [DatasetId.CMIP5]
    },
    [VariableId.IceThickness]: {
        [StageType.Future]: [DatasetId.CMIP5]
    },
    [VariableId.SnowDepth]: {
        [StageType.Future]: [DatasetId.CMIP5]
    }
};
