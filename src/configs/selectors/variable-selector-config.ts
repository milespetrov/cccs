import { VariableId, DatasetId } from './../datasets/types';
import { VariableSelectorConfig, VariableStageType } from './types';

export const variableSelectorConfig: VariableSelectorConfig = {
    groups: [
        {
            id: 'temperature_group',
            items: [VariableId.TMean, VariableId.TMin, VariableId.TMax]
        },
        {
            id: 'precipitation_group',
            items: [VariableId.Precipitation]
        },
        {
            id: 'wind_group',
            items: [VariableId.SurfaceWind]
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

interface VariableStageMap {
    [VariableStageType.Historic]?: DatasetId[];
    [VariableStageType.Future]?: DatasetId[];
}

interface VariableStageMapping {
    [name: string]: VariableStageMap;
}

const stages: VariableStageMapping = {
    [VariableId.TMean]: {
        [VariableStageType.Historic]: [DatasetId.AHCCD],
        [VariableStageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    },
    [VariableId.TMax]: {
        [VariableStageType.Historic]: [DatasetId.AHCCD],
        [VariableStageType.Future]: [DatasetId.CMIP5, DatasetId.CANGRD]
    }
};
