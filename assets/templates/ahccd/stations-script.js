function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            stationName: 'Station name',
            stationId: 'AHCCD station ID',
            coordinates: 'Coordinates',
            elevation: 'Elevation',
            province: 'Province/Territory'
        },

        'fr-CA': {
            stationName: '[fr] Station name',
            stationId: '[fr] AHCCD station ID',
            coordinates: '[fr] Coordinates',
            elevation: '[fr] Elevation',
            province: '[fr] Province/Territory'
        }
    };

    console.log(data);

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
