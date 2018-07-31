import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, VariableId, DatasetId } from '@/types';

const normalDataset: DatasetSource = {
    id: DatasetId.ClimateNormal,

    controls: {
        [VisualizationControlType.Time]: {
            default: TimePeriodType.Annual,
            options: [
                TimePeriodType.Annual,
                TimePeriodType.January,
                TimePeriodType.February,
                TimePeriodType.March,
                TimePeriodType.May,
                TimePeriodType.June,
                TimePeriodType.July,
                TimePeriodType.August,
                TimePeriodType.September,
                TimePeriodType.October,
                TimePeriodType.November,
                TimePeriodType.December
            ],
            disableOn: [VariableId.ClimateStations]
        }
    },

    variables: [
        VariableId.ClimateStations,
        VariableId.TMax,
        VariableId.TMean,
        VariableId.TMin,
        VariableId.Precipitation
    ],

    legend: {
        [VariableId.ClimateStations]: '<img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.TMax]: '<img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.TMean]: '<img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.TMin]: '<img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.Precipitation]: '<img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">'
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default normalDataset;
