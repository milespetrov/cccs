function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            latlong: 'Latitude, longitude',
            trendValue: {
                spei: 'Standardized precipitation and evapotranspiration index',
            }
        },

        'fr-CA': {
            latlong: 'Latitude, longitude',
            trendValue: {
                spei: 'Standardized precipitation and evapotranspiration index',
            }
        }
    };

    var result = {};

    result.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];

    result.value = parseFloat(data.features[0].properties.value).toFixed(1);
    result.latlong = window.RAMP.GAPI.proj.localProjectPoint(3978, 4326, data.features[0].geometry.coordinates);

    result.tt = TRANSLATIONS[lang];

    return result;
}
