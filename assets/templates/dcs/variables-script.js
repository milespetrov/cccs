function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            latlong: 'Latitude, Longitude',
            trendValue: 'Projected 20-year average changes'
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
