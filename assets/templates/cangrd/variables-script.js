function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            latlong: 'Latitude, Longitude',
            trendValue: {
                precip: 'Trend of relative total precipitation change (%) over 1948-2012',
                tmean: 'Trend of temperature change (°C) over 1948-2016'
            },
            learnMore: {
                precip: 'Learn more about CANGRD total precipitation trend for 1948–2012',
                tmean: 'Learn more about CANGRD mean temperature trend for 1948–2016'
            }
        },

        'fr-CA': {}
    };

    console.log(data, lang);
    var result = {};

    result.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];

    result.value = parseFloat(data.features[0].properties.value).toFixed(2);
    result.latlong = window.RZ.GAPI.proj.localProjectPoint(3978, 4326, data.features[0].geometry.coordinates);

    result.tt = TRANSLATIONS[lang];

    return result;
}
