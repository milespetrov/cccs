function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            latlong: 'Latitude, longitude',
            trendValue: {
                precip: 'Trend of relative total precipitation change (%) over 1948-2012',
                tmean: 'Trend of temperature change (°C) over 1948-2016'
            },
            learnMore: {
                default: 'Learn more about Canadian Gridded Temperature and Precipitation Anomalies (CANGRD) dataset.',
                link: 'https://www.canada.ca/en/environment-climate-change/services/climate-change/canadian-centre-climate-services/display-download/technical-documentation-historical-climate-data.html'
            }
        },

        'fr-CA': {
            latlong: 'Latitude, longitude',
            trendValue: {
                precip: 'Tendance de la variation relative des précipitations totales (%) de 1948 à 2012',
                tmean: 'Tendance de la variation de température (°C) de 1948 à 2016'
            },
            learnMore: {
                default: 'En savoir plus sur l’ensemble de données Anomalies de température et précipitation interpolées pour le Canada (CANGRD).',
                link: 'https://www.canada.ca/fr/environnement-changement-climatique/services/changements-climatiques/centre-canadien-services-climatiques/afficher-telecharger/documentation-technique-donnees-climatiques-historiques.html'
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
