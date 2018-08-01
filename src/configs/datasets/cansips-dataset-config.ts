import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, RCPType, VariableId, DatasetId, ViewType } from '@/types';

const canSipsDataset: DatasetSource = {
    id: DatasetId.CanSIPS,

    controls: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual
        }
    },

    variables: [],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    queryToolRoute: {
        en: '/seasonal-forecasts',
        fr: '/previsions-saisonnieres'
    }
};

export default canSipsDataset;
