function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            stationName: 'Station name',
            stationId: 'AHCCD station ID',
            coordinates: 'Coordinates',
            elevation: 'Elevation',

            recordingPeriod: 'Data years',
            startDate: 'Start date',
            endDate: 'End date',

            measurements: [
                'total_precip',
                'rain',
                'temp_mean',
                'temp_max',
                'temp_min',
                'snow',
                'wind_speed',
                'pressure_station',
                'pressure_sea_level'
            ],

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
            }
        },

        'fr-CA': {}
    };

    data.properties = {};

    data.forEach(function(el) {
        if (typeof el.value === 'string') {
            el.value = el.value.trim();
        }
        data.properties[el.key] = el.value;
    });

    data.tt = TRANSLATIONS[lang];

    return data;
}
