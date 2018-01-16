let currentView: string = 'chart-view';

const timePeriods: string[] = [
    'Jan_Janv',
    'Feb_Fev',
    'Mar_March',
    'Apr_Avr',
    'May_Mai',
    'June_Juin',
    'July_Juil',
    'Aug_Aout',
    'Sept_Sept',
    'Oct_Oct',
    'Nov_Nov',
    'Dec_Dec',
    'Annual_Annuel',
    'Winter_Hiver',
    'Spring_Printemp',
    'Summer_Ete',
    'Autumn_Autome'
];
let selectedTimePeriod: string = timePeriods[0];

export default {
    currentView,
    timePeriods,
    selectedTimePeriod
};
