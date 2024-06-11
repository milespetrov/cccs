import VariableSelector from './variable-selector.vue';
import DatasetSelector from './dataset-selector.vue';
import TimePeriodSelector from './time-period-selector.vue';
import RcpSelector from './rcp-selector.vue';
import SspSelector from './ssp-selector.vue';
import AnalysisPeriodSelector from './analysis-period-selector.vue';
import MonthSelector from './month-selector.vue';
import DaySelector from './day-selector.vue';
import SupplementalSelector from './supplemental-selector.vue';

// export all selectors to use in map-view-controls
export default {
    'variable-selector': VariableSelector,
    'dataset-selector': DatasetSelector,
    'rcp-selector': RcpSelector,
    'ssp-selector': SspSelector,
    'time-period-selector': TimePeriodSelector,
    'analysis-period-selector': AnalysisPeriodSelector,
    'month-selector': MonthSelector,
    'day-selector': DaySelector,
    'supplemental-selector': SupplementalSelector
};
