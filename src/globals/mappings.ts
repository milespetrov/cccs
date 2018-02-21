
interface string_to_num {
    [key: string]: number
}

interface string_to_string {
    [key: string]: string
}

// For displaying on the chart, tooltips, etc.
const periodToNames: string_to_string = {
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
    Winter_Hiver: 'Winter',
    Spring_Printemp: 'Spring',
    Summer_Ete: 'Summer',
    Autumn_Autome: 'Autumn',
    Annual_Annuel: 'Annual'
};

// For mapping to the data API
const periodToNum: string_to_num = {
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
    Winter_Hiver: 13,
    Spring_Printemp: 14,
    Summer_Ete: 15,
    Autumn_Autome: 16,
    Annual_Annuel: 17
};

export default {
    periodToNames,
    periodToNum
}