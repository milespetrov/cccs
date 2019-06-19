function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            latlong: 'Latitude, longitude',
            trendValue: {
                default: 'Projected 20-year average changes in',
                tmean: 'mean temperature (degree Celsius)',
                tmin: 'minimum temperature (degree Celsius)',
                tmax: 'maximum temperature (degree Celsius)',
                precip: 'total precipitation (%)'
            },
            learnMore: {
                default: 'Learn more about the Statistically downscaled climate data dataset.',
                link: 'https://www.canada.ca/en/environment-climate-change/services/climate-change/canadian-centre-climate-services/display-download/technical-documentation-downscaled-climate-scenarios.html'
            }
        },

        'fr-CA': {
            latlong: 'Latitude, longitude',
            trendValue: {
                default: 'Changements projetés des moyennes sur 20 ans',
                tmean: 'température moyenne (degrés Celsius)',
                tmin: 'température minimale (degrés Celsius)',
                tmax: 'température maximale (degrés Celsius)',
                precip: 'précipitations totales (%)'
            },
            learnMore: {
                default:
                    "En savoir plus sur l’ensemble de données Scénarios climatiques mis à l’échelle de manière statistique.",
                link: 'https://www.canada.ca/fr/environnement-changement-climatique/services/changements-climatiques/centre-canadien-services-climatiques/afficher-telecharger/documentation-technique-scenarios-climatiques-echelle-reduite.html'
            }
        }
    };

    var result = {};

    result.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];

    result.value = parseFloat(data.features[0].properties.value).toFixed(1);
    result.latlong = window.RZ.GAPI.proj.localProjectPoint(3978, 4326, data.features[0].geometry.coordinates);

    result.tt = TRANSLATIONS[lang];

    return result;
}
