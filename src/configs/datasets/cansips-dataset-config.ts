import { DatasetSource } from './types';
import { VariableId, DatasetId } from '@/types';

const canSipsDataset: DatasetSource = {
    id: DatasetId.CanSIPS,

    controls: {},

    variables: [
        VariableId.SeaLevelPressure,
        VariableId.Precipitation,
        VariableId.TMean,
        VariableId.SurfaceTemp,
        VariableId.WaterTemp,
        VariableId.GustDirection,
        VariableId.GustDirection850,
        VariableId.Geopotential
    ],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    queryToolRoute: {
        en: '/seasonal-forecasts',
        fr: '/previsions-saisonnieres'
    }
};

export default canSipsDataset;
