import { VariableId, DatasetId } from './../datasets/types';
import { VariableSelectorConfig, StageType, StageMapping } from './types';

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

export const stages: StageMapping = {
    [VariableId.TMean]: {
        [StageType.Historic]: [DatasetId.AHCCD],
        [StageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.TMax]: {
        [StageType.Historic]: [DatasetId.AHCCD],
        [StageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.TMin]: {
        [StageType.Historic]: [DatasetId.AHCCD],
        [StageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.Precipitation]: {
        [StageType.Historic]: [DatasetId.AHCCD],
        [StageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.SurfaceWind]: {
        [StageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.IceFraction]: {
        [StageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.IceThickness]: {
        [StageType.Historic]: [DatasetId.AHCCD]
    },
    [VariableId.SnowDepth]: {
        [StageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    }
};
