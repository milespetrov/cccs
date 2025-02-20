import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, VariableId, RCPType, DatasetId, IdentifyMode } from '@/types';

const speiDataset: DatasetSource = {
    id: DatasetId.SPEI,

    controls: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual,
            options: [
                TimePeriodType.Annual,
            ]
        },
        [VisualizationControlType.RCP]: {
            default: RCPType.RCP8_5
        }
    },

    filters: [],

    variables: [VariableId.SPEI],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',

    identifyMode: [IdentifyMode.Query, IdentifyMode.Marker, IdentifyMode.Details]
};

export default speiDataset;
