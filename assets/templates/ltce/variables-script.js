function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            station_name: 'Virtual Station Name, Period of Record',
            date: 'Date of Year',
            record_type: 'Record Type',
            first_value: 'Extreme Value (Year)',
            second_value: '2nd Extreme Vaue (Year)',
            third_value: '3rd Extreme Value (Year)',
            fourth_value: '4th Extreme Value (Year)',
            fifth_value: '5th Extreme Value (Year)',
            last_updated: 'Last Updated',
            time_separator: ' to ',
            months: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ],
            record_types: {
                'tmaxh': 'Record High Maximum Temperature',
                'tmaxl': 'Record Low Maximum Temperature',
                'tminh': 'Record High Minimum Temperature',
                'tminl': 'Record Low Minimum Temperature',
                'snd': 'Record Snowfall',
                'precip': 'Record Precipitation'
            }
        },

        'fr-CA': {
            station_name: 'Virtual Station Name, Period of Record [fr]',
            date: 'Date of Year [fr]',
            record_type: 'Record Type [fr]',
            first_value: 'Extreme Value (Year) [fr]',
            second_value: '2nd Extreme Value (Year) [fr]',
            third_value: '3rd Extreme Value (Year) [fr]',
            fourth_value: '4th Extreme Value (Year) [fr]',
            fifth_value: '5th Extreme Value (Year) [fr]',
            last_updated: 'Last Updated [fr]',
            time_separator: ' à [fr]',
            months: [
                'Janvier',
                'Février',
                'Mars',
                'Avril',
                'Mai',
                'Juin',
                'Juillet',
                'Août',
                'Septembre',
                'Octobre',
                'Novembre',
                'Décembre'
            ],
            record_types: {
                'tmaxh': 'Record High Maximum Temperature [fr]',
                'tmaxl': 'Record Low Maximum Temperature [fr]',
                'tminh': 'Record High Minimum Temperature [fr]',
                'tminl': 'Record Low Minimum Temperature [fr]',
                'snd': 'Record Snowfall [fr]',
                'precip': 'Record Precipitation [fr]'
            }
        }
    };

    data.properties = {};

    const variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];
    data.properties.variable = variable;

    data.forEach(function(el) {
        if (typeof el.value === 'string') {
            el.value = el.value.trim();
        } 
        if (el.key === 'LAST_UPDATED') {
            el.value = el.value.split('T')[0];
        }
        data.properties[el.key] = el.value;
    });

    const mappings = {
        'tmaxh': 'HIGH_MAX_TEMP',
        'tmaxl': 'LOW_MAX_TEMP',
        'tminh': 'HIGH_MIN_TEMP',
        'tminl': 'LOW_MIN_TEMP',
        'precip': 'PRECIPITATION',
        'snd': 'SNOWFALL'
    }
    const mappings2 = {
        'tmaxh': 'MAX_TEMP_',
        'tmaxl': 'MAX_TEMP_',
        'tminh': 'MIN_TEMP_',
        'tminl': 'MIN_TEMP_',
        'precip': '',
        'snd': '',
    }

    data.properties.RECORD_BEGIN = data.properties[mappings2[variable] + 'RECORD_BEGIN'].split('T')[0];
    data.properties.RECORD_END = data.properties[mappings2[variable] + 'RECORD_END'];
    if (!data.properties.RECORD_END) {
        data.properties.RECORD_END = 'Present'; // TODO: FRENCH
    } else {
        data.properties.RECORD_END = data.properties.RECORD_END.split('T')[0];
    }
    data.properties.FIRST_VALUE = data.properties['FIRST_' + mappings[variable]];
    data.properties.SECOND_VALUE = data.properties['SECOND_' + mappings[variable]];
    data.properties.THIRD_VALUE = data.properties['THIRD_' + mappings[variable]];
    data.properties.FOURTH_VALUE = data.properties['FOURTH_' + mappings[variable]];
    data.properties.FIFTH_VALUE = data.properties['FIFTH_' + mappings[variable]];
    data.properties.FIRST_YEAR= data.properties['FIRST_' + mappings[variable] + '_YEAR'];
    data.properties.SECOND_YEAR = data.properties['SECOND_' + mappings[variable] + '_YEAR'];
    data.properties.THIRD_YEAR= data.properties['THIRD_' + mappings[variable] + '_YEAR'];
    data.properties.FOURTH_YEAR = data.properties['FOURTH_' + mappings[variable] + '_YEAR'];
    data.properties.FIFTH_YEAR= data.properties['FIFTH_' + mappings[variable] + '_YEAR'];

    data.lang = lang;

    data.tt = TRANSLATIONS[lang];

    console.log(data);

    return data;
}
