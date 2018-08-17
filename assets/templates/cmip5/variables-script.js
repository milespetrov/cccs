function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            latlong: 'Latitude, Longitude',
            trendValue: {
                default: 'Projected 20-year average changes in',
                tmean: 'mean temperature (degree Celsius)',
                sic: 'sea ice concentration (%)',
                sit: 'sea ice thickness (%)',
                precip: 'mean precipitation (%)',
                sfcwind: 'wind speed (%)',
                snd: 'snow depth (%)'
            },
            learnMore: {
                default: 'Learn more about projected',
                tmean: 'mean temperature change',
                precip: 'mean precipitation change',
                sic: 'sea ice concentration change',
                sit: 'sea ice thickness change',
                sfcwind: 'wind speed change',
                snd: 'snow depth change'
            }
        },

        'fr-CA': {}
    };

    console.log(data, lang);
    if (typeof data === 'undefined') {
        return null;
    }

    var result = {};

    result.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];

    var tempVal = data.features[0].properties.value;
    var parsedVal = Number.parseFloat(tempVal).toFixed(2); // seems to not error if gargabe is passed in
    
    result.value = isNaN(parsedVal) ? tempVal : parsedVal;
    result.latlong = window.RZ.GAPI.proj.localProjectPoint(3978, 4326, data.features[0].geometry.coordinates);

    result.tt = TRANSLATIONS[lang];

    return result;
}
