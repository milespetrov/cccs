interface StringToNum {
    [key: string]: number;
}

interface StringToString {
    [key: string]: string;
}

// For displaying on the chart, tooltips, etc.
const periodToNames: StringToString = {
    Jan_Janv: 'January',
    Feb_Fev: 'February',
    Mar_March: 'March',
    Apr_Avr: 'April',
    May_Mai: 'May',
    June_Juin: 'June',
    July_Juil: 'July',
    Aug_Aout: 'August',
    Sept_Sept: 'September',
    Oct_Oct: 'October',
    Nov_Nov: 'November',
    Dec_Dec: 'December',
    winter: 'Winter',
    spring: 'Spring',
    summer: 'Summer',
    fall: 'Autumn',
    annual: 'Annual'
};

// For mapping to the data API
const periodToNum: StringToNum = {
    Jan_Janv: 1,
    Feb_Fev: 2,
    Mar_March: 3,
    Apr_Avr: 4,
    May_Mai: 5,
    June_Juin: 6,
    July_Juil: 7,
    Aug_Aout: 8,
    Sept_Sept: 9,
    Oct_Oct: 10,
    Nov_Nov: 11,
    Dec_Dec: 12,
    winter: 13,
    spring: 14,
    summer: 15,
    fall: 16,
    annual: 17
};

export default {
    periodToNames,
    periodToNum
};
