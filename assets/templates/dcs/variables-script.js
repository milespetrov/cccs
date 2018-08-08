function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            latlong: 'Latitude, Longitude',
            trendValue: {
                default: 'Projected 20-year average changes in',
                tmean: 'mean temperature (degree Celsius)',
                tmin: 'minimum temperature (degree Celsius)',
                tmax: 'maximum temperature (degree Celsius)',
                precip: 'total precipitation (%)'
            },
            learnMore: {
                default: 'Learn more about statistically downscaled scenarios of projected',
                tmean: 'mean temperature change',
                tmin: 'minimum temperature change',
                tmax: 'maximum temperature change',
                precip: 'total precipitation change'
            }
        },

        'fr-CA': {}
    };

    console.log(data, lang);
    var result = {};

    result.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];

    result.value = data.features[0].properties.value;
    result.latlong = window.RZ.GAPI.proj.localProjectPoint(3978, 4326, data.features[0].geometry.coordinates);

    result.tt = TRANSLATIONS[lang];

    return result;
}
