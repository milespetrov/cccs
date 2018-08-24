function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            stationId: 'AHCCD station ID',
            trendValue: 'Trend value',
            no_trend: 'No trend calculated',
            elevation: 'Elevation',
            province: 'Province/Territory',
            measurementUnit: {
                total_precip: 'mm',
                temp_mean: '°C',
                temp_max: '°C',
                temp_min: '°C',
                wind_speed: 'km/h',
                pressure_station: 'kPa',
                pressure_sea_level: 'kPa'
            },
            yearRange: 'Trend period',
            noYearRange: 'No trend period',
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
                Smr: 'Summer',
                Fal: 'Autumn',
                Ann: 'Annual'
            },
            learnMore: {
                default: 'Learn more about',
                tmean: 'homogenized mean temperature',
                tmin: 'homogenized minimum temperature',
                tmax: 'homogenized maximum temperature',
                precip: 'adjusted total precipitation',
                sfcwind: 'homogenized wind speed',
                stnpress: 'homogenized station pressure',
                seapress: 'homogenized sea level pressure'
            }
        },

        'fr-CA': {}
    };

    console.log(data, lang);

    data.properties = {};

    data.properties.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];

    data.forEach(function(el) {
        if (el.key === 'trend_value') {
            // round the trend value. if not parsable, keep orig value.
            var parsedVal = parseFloat(el.value).toFixed(2); // seems to not error if gargabe is passed in
            if (!isNaN(parsedVal)) {
                el.value = parsedVal;
            }
        }
        data.properties[el.key] = el.value;
    });
    data.tt = TRANSLATIONS[lang];

    if (data.properties.trend_value) {
        if (parseFloat(data.properties.trend_value) > 0) {
            data.properties.trend_prefix = '+';
        }
    }

    return data;
}
