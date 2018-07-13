function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            stationName: 'AHHCD station',
            stationId: 'Station ID',
            province: {
                title: 'Province',
                ab: 'Alberta',
                bc: 'British Columbia',
                mb: 'Manitoba',
                nb: 'New Brunswick',
                nl: 'Newfoundland and Labrador',
                ns: 'Nova Scotia',
                nt: 'Northwest Territories',
                nu: 'Nunavut',
                on: 'Ontario',
                pe: 'Prince Edward Island',
                QUE: 'Quebec Québec',
                sk: 'Saskatchewan',
                yt: 'Yukon Yukon'
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

    // TODO: remove sample data when ahccd wfs is fixed
    const sampleData = {
        properties: {
            /* coordinates: '51.5074° N, 0.1278° W',

            start: {
                title: '1906',
                total_precip: '1906',
                rain: '1906',
                temp_mean: '1906',
                temp_max: '1906',
                temp_min: '1906',
                snow: '1906',
                wind_speed: '1906',
                pressure_station: '1906',
                pressure_sea_level: '1906'
            },
            end: {
                title: '2016',
                total_precip: '2016',
                rain: '2016',
                temp_mean: '2016',
                temp_max: '2016',
                temp_min: '2016',
                snow: '2016',
                wind_speed: '2016',
                pressure_station: '2016',
                pressure_sea_level: '2016'
            }, */

            province: 'QUE',
            elevation: '146.5',
            joined: '0',
            station_id: '7056616',
            station_name: 'RIVIERE-DU-LOUP',
            identifier: '7056616'
        }
    };

    console.log(data, lang);

    // TODO: use sample data until ahccd wfs is fixed
    data = sampleData;
    data.tt = TRANSLATIONS[lang];

    return data;
}
