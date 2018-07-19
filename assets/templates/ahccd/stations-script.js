function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            stationName: 'Station Name',
            stationId: 'AHCCD Station ID',
            province: {
                title: 'Province',
                AB: 'Alberta',
                BC: 'British Columbia',
                MAN: 'Manitoba',
                MB: 'Manitoba',
                NB: 'New Brunswick',
                NL: 'Newfoundland and Labrador',
                NFLD: 'Newfoundland and Labrador',
                NS: 'Nova Scotia',
                NWT: 'Northwest Territories',
                NU: 'Nunavut',
                ON: 'Ontario',
                PE: 'Prince Edward Island',
                PEI: 'Prince Edward Island',
                QUE: 'Quebec',
                QC: 'Quebec',
                SK: 'Saskatchewan',
                YT: 'Yukon'
            },
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

    data.forEach(({ key, value }) => {
        if (typeof value === 'string') {
            value = value.trim();
        }
        data.properties[key] = value;
    });

    data.tt = TRANSLATIONS[lang];

    return data;
}
