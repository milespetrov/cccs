function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            latlong: 'Latitude, longitude',
            value: 'Total precipitation amount analysis (mm)',
            value2: 'Confidence index'
        },

        'fr-CA': {
            latlong: 'Latitude, longitude',
            value: 'Analyse de la quantité totale de précipitations (mm)',
            value2: 'Indice de confiance'
        }
    };

    var result = {
        properties: {}
    };

    result.data = data.split('Feature 0:')[1].split('\n');
    result.tt = TRANSLATIONS[lang];

    for (var i = 1; i < result.data.length; i++) {
        var splitResult = result.data[i]
            .trim()
            .split(' = ')
            .map(function(val) {
                return val.replace(/'/g, '');
            });
        result.properties[splitResult[0]] = splitResult[1];
    }

    result.properties.value_0 = parseFloat(result.properties.value_0).toFixed(1);

    result.properties.latlong = window.RZ.GAPI.proj.localProjectPoint(3978, 4326, [
        parseFloat(result.properties.x),
        parseFloat(result.properties.y)
    ]);

    return result;
}
