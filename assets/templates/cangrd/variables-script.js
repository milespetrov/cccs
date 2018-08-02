function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            latlong: 'Latitude, Longitude',
            trendValue: 'Climate value',
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
    var result = {};

    result.value = data.features[0].properties.value;
    result.latlong = window.RZ.GAPI.proj.localProjectPoint(3978, 4326, data.features[0].geometry.coordinates);

    result.tt = TRANSLATIONS[lang];

    return result;
}
