function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            stationId: 'AHCCD station ID',
            trendValue: 'Trend value',
            no_trend: 'No trend calculated',
            measurementType: {
                title: 'Measurement type',
                total_precip: 'Total precipitation',
                //rain: 'Rain ????',
                temp_mean: 'Mean temperature',
                temp_max: 'Maximum temperature',
                temp_min: 'Minimum temperature',
                //snow: 'Snow depth',
                wind_speed: 'Wind speed',
                pressure_station: 'Surface pressure',
                pressure_sea_level: 'Sea level pressure'
            },
            measurementUnit: {
                total_precip: 'mm',
                //rain: 'mm ????',
                temp_mean: '°C',
                temp_max: '°C',
                temp_min: '°C',
                //snow: 'mm ??',
                wind_speed: 'km/h',
                pressure_station: 'kPa',
                pressure_sea_level: 'kPa'
            },
            timePeriod: {
                title: 'Time period',
                Jan: 'January',
                Feb: 'February',
                Mar: 'March',
                Apr: 'April',
                May: 'May',
                Jun: 'June',
                Jul: 'July',
                Aug: 'August',
                Sep: 'September',
                Oct: 'October',
                Nov: 'November',
                Dec: 'December',
                Win: 'Winter',
                Spr: 'Spring',
                Sum: 'Summer',
                Fal: 'Autumn',
                Ann: 'Annual'
            }
        },

        'fr-CA': {}
    };

    console.log(data, lang);

    data.properties = {};

    data.forEach(function(el) {
        data.properties[el.key] = el.value;
    });
    data.tt = TRANSLATIONS[lang];

    return data;
}
