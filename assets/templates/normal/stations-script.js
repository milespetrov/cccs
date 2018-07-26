function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            station_name: 'Station Name',
            stn_id: 'MSC Station ID',
            province: {
                title: 'Province',
                AB: 'Alberta',
                BC: 'British Columbia',
                MB: 'Manitoba',
                NB: 'New Brunswick',
                NL: 'Newfoundland and Labrador',
                NS: 'Nova Scotia',
                NT: 'Northwest Territories',
                NU: 'Nunavut',
                ON: 'Ontario',
                PE: 'Prince Edward Island',
                QC: 'Quebec',
                SK: 'Saskatchewan',
                YT: 'Yukon'
            },
            coordinates: 'Coordinates',
            latitude: 'Latitude',
            longitude: 'Longitude',
            elevation: 'Elevation',

            recordingPeriod: 'Data years',
            startDate: 'Start date',
            endDate: 'End date'
        },

        'fr-CA': {}
    };

    data.properties = {};

    data.forEach(function({ key, value }) {
        if (typeof value === 'string') {
            value = value.trim();
        }
        data.properties[key] = value;
    });

    data.properties.LONGITUDE = data.properties.LONGITUDE / 10000000;
    data.properties.LATITUDE = data.properties.LATITUDE / 10000000;

    data.tt = TRANSLATIONS[lang];

    return data;
}
