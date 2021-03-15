import { MonthSelectorConfig } from './types';
import { TimePeriodType } from '@/types';

export const monthSelectorConfig: MonthSelectorConfig = {
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
            showHeader: false
        }
    ]
};
