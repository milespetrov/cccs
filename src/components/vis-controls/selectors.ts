import VariableSelector from './variable-selector.vue';
import DatasetSelector from './dataset-selector.vue';
import TimePeriodSelector from './time-period-selector.vue';
import RcpSelector from './rcp-selector.vue';
import AnalysisPeriodSelector from './analysis-period-selector.vue';

// export all selectors to use in map-view-controls
export default {
    'variable-selector': VariableSelector,
    'dataset-selector': DatasetSelector,
    'rcp-selector': RcpSelector,
    'time-period-selector': TimePeriodSelector,
    'analysis-period-selector': AnalysisPeriodSelector
};
