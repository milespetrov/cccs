function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            stationId: 'AHCCD station ID',
            trendValue: 'Trend value',
            measurementType: {
                title: 'Measurement type',
                total_precip: 'Total precipitation',
                rain: 'Rain ????',
                temp_mean: 'Mean temperature',
                temp_max: 'Maximum temperature',
                temp_min: 'Minimum temperature',
                snow: 'Snow depth',
                wind_speed: 'Wind speed',
                pressure_station: 'Surface pressure',
                pressure_sea_level: 'Sea level pressure'
            },
            measurementUnit: {
                total_precip: 'mm',
                rain: 'mm ????',
                temp_mean: '°C',
                temp_max: '°C',
                temp_min: '°C',
                snow: 'mm ??',
                wind_speed: 'm/s ??',
                pressure_station: 'kPa ??',
                pressure_sea_level: 'kPa ??'
            },
            timePeriod: {
                title: 'Time period',
                Jan: 'January ',
                Feb: 'February ',
                Mar: 'March ',
                Apr: 'April ',
                May: 'May ',
                Jun: 'June ',
                Jul: 'July ',
                Aug: 'August ',
                Sep: 'September ',
                Oct: 'October ',
                Nov: 'November ',
                Dec: 'December ',
                Win: 'Winter ',
                Spr: 'Spring ',
                Sum: 'Summer ',
                Fal: 'Autumn ',
                Ann: 'Annual'
            }
        },

        'fr-CA': {}
    };

    const sampleData = {
        properties: {
            trend_value: 237.4600067138672,
            measurement_type: 'total_precip',
            identifier: '1017230.Ann.total_precip',
            period: 'Ann',
            station_id: '1017230'
        }
    };

    console.log(data, lang);

    data.properties = {};

    data.forEach(({ key, value }) => (data.properties[key] = value));
    // TODO: use sample data until ahccd wfs is fixed
    // data = sampleData;
    data.tt = TRANSLATIONS[lang];

    return data;

    /* return stuff.split('\n').reduce((map, line) => {
        const [key, value] = line.split('=');
        map[(key || '').trim()] = (value || '').trim().replace(`'`, '');
        return map;
    }, {}); */
}
