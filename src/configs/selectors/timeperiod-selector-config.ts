import { TimePeriodSelectorConfig, TimePeriodType } from './types';

export const timePeriodSelectorConfig: TimePeriodSelectorConfig = {
    groups: [
        {
            id: 'monthly_group',
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
            ],
            showHeader: true
        },
        {
            id: 'season_group',
            items: [TimePeriodType.Winter, TimePeriodType.Spring, TimePeriodType.Summer, TimePeriodType.Autumn],
            showHeader: true
        },
        {
            id: 'annual_group',
            items: [TimePeriodType.Annual],
            showHeader: true
        }
    ]
};
