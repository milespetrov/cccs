import { TimePeriodSelectorConfig, TimePeriodType } from './types';

export const timePeriodSelectorConfig: TimePeriodSelectorConfig = {
    groups: [
        {
            id: 'monthly-group',
            items: [
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
            ]
        },
        {
            id: 'season-group',
            items: [TimePeriodType.Winter, TimePeriodType.Spring, TimePeriodType.Summer, TimePeriodType.Autumn]
        },
        {
            id: 'annual-group',
            items: [TimePeriodType.Annual]
        }
    ]
};
