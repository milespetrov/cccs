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
            stationName: 'Nom de la station',
            stationId: 'Numéro de la station DCCAH',
            coordinates: 'Coordonnées',
            elevation: 'Altitude',
            province: 'Province / Territoire'
        }
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
