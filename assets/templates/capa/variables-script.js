function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            latlong: 'Latitude, Longitude',
            value: 'Amount of precipitation (mm)'
        },

        'fr-CA': {}
    };

    console.log(data, lang);
    var result = {
        properties: {}
    };

    result.data = data.split('Feature 0:')[1].split('\n');
    result.tt = TRANSLATIONS[lang];

    for (var i = 1; i < result.data.length; i++) {
        var [key, value] = result.data[i]
            .trim()
            .split(' = ')
            .map(function(val) {
                return val.replace(/'/g, '');
            });
        result.properties[key] = value;
    }

    result.properties.latlong = window.RZ.GAPI.proj.localProjectPoint(3978, 4326, [
        parseFloat(result.properties.x),
        parseFloat(result.properties.y)
    ]);

    return result;
}
