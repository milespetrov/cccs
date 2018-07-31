function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            station_name: 'Station name',
            stn_id: 'MSC station ID',
            station_type: 'Station type',
            province: 'Province/Territory',
            latitude: 'Latitude',
            longitude: 'Longitude',
            elevation: 'Elevation',
            timezone: 'Time zone',
            station_operator: 'Station operator',
            tc_identifier: 'Transport Canada identifier',
            wmo_identifier: 'WMO identifier',
            climate_identifier: 'Climate identifier'
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

    data.properties.LONGITUDE = data.properties.LONGITUDE / 10000000;
    data.properties.LATITUDE = data.properties.LATITUDE / 10000000;

    data.tt = TRANSLATIONS[lang];

    return data;
}
