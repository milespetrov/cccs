import VariableSelector from './variable-selector.vue';
import TimePeriodSelector from './time-period-selector.vue';
import RcpSelector from './rcp-selector.vue';

//Export all selectors to use in chart-view-controls and map-view-controls
export default {
    'variable-selector': VariableSelector,
    'rcp-selector': RcpSelector,
    'time-period-selector': TimePeriodSelector
};
