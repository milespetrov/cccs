import { RCPSelectorConfig } from './types';
import { AnalysisPeriodType } from '@/types';

export const analysisperiodSelectorConfig: RCPSelectorConfig = {
    groups: [
        {
            id: 'all_analysis_periods',
            items: [AnalysisPeriodType.Six, AnalysisPeriodType.TwentyFour],
            showHeader: false
        }
    ]
};
