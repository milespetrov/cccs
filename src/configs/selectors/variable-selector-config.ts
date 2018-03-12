import { VariableId, DatasetId } from './../datasets/types';
import { VariableSelectorConfig, VariableStageType, VariableStageMapping } from './types';

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
            items: [VariableId.IceFraction, VariableId.IceThickness]
        },
        {
            id: 'snow_depth_group',
            items: [VariableId.SnowDepth]
        }
    ]
};

export const variableStages: VariableStageMapping = {
    [VariableId.TMean]: {
        [VariableStageType.Historic]: [DatasetId.AHCCD],
        [VariableStageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.TMax]: {
        [VariableStageType.Historic]: [DatasetId.AHCCD],
        [VariableStageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.TMin]: {
        [VariableStageType.Historic]: [DatasetId.AHCCD],
        [VariableStageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.Precipitation]: {
        [VariableStageType.Historic]: [DatasetId.AHCCD],
        [VariableStageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.SurfaceWind]: {
        [VariableStageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.IceFraction]: {
        [VariableStageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.IceThickness]: {
        [VariableStageType.Historic]: [DatasetId.AHCCD]
    },
    [VariableId.SnowDepth]: {
        [VariableStageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    }
};
