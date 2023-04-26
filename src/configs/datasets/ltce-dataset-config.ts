import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, VariableId, DatasetId, IdentifyMode } from '@/types';

const ltceDataset: DatasetSource = {
    id: DatasetId.LTCE,

    controls: {[VisualizationControlType.Month]: {
        default: TimePeriodType.January,
        options: [
            TimePeriodType.January,
            TimePeriodType.February,
            TimePeriodType.March,
            TimePeriodType.April,
            TimePeriodType.May,
            TimePeriodType.June,
            TimePeriodType.July,
            TimePeriodType.August,
            TimePeriodType.September,
            TimePeriodType.October,
            TimePeriodType.November,
            TimePeriodType.December
        ],
        disableOn: [VariableId.TemperatureStations, VariableId.PrecipitationStations, VariableId.SnowfallStations]
    },
        [VisualizationControlType.Day]: {
            default: '1',
            options: [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
                '21',
                '22',
                '23',
                '24',
                '25',
                '26',
                '27',
                '28',
                '29',
                '30',
                '31'
            ],
            disableOn: [VariableId.TemperatureStations, VariableId.PrecipitationStations, VariableId.SnowfallStations]
    }},

    variables: [
        VariableId.TemperatureStations,
        VariableId.PrecipitationStations,
        VariableId.SnowfallStations,
        VariableId.Precipitation,
        VariableId.SnowDepth,
        VariableId.TMaxHigh,
        VariableId.TMaxLow,
        VariableId.TMinHigh,
        VariableId.TMinLow
    ],

    legend: {
        [VariableId.SnowfallStations]: '<img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.SnowDepth]: ['<img src="assets/images/blue-circle.svg" style="width: 14px; height: 14px;">',
        '<img src="assets/images/yellow-circle.svg" style="width: 14px; height: 14px;">'],
        [VariableId.TMaxHigh]: ['<img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        '<img src="assets/images/yellow-circle.svg" style="width: 14px; height: 14px;">'],
        [VariableId.TMaxLow]: ['<img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        '<img src="assets/images/yellow-circle.svg" style="width: 14px; height: 14px;">'],
        [VariableId.TMinHigh]: ['<img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        '<img src="assets/images/yellow-circle.svg" style="width: 14px; height: 14px;">'],
        [VariableId.TMinLow]: ['<img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        '<img src="assets/images/yellow-circle.svg" style="width: 14px; height: 14px;">'],
        [VariableId.TemperatureStations]: '<img src="assets/images/red-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.PrecipitationStations]: '<img src="assets/images/green-circle.svg" style="width: 14px; height: 14px;">',
        [VariableId.Precipitation]: ['<img src="assets/images/green-circle.svg" style="width: 14px; height: 14px;">',
        '<img src="assets/images/pink-circle.svg" style="width: 14px; height: 14px;">']
    },

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json',
    identifyMode: [
        IdentifyMode.Query,
        IdentifyMode.Marker,
        IdentifyMode.Highlight,
        IdentifyMode.Haze,
        IdentifyMode.Details
    ]
};

export default ltceDataset;
