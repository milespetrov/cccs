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
                default: 'Learn more about statistically downscaled scenarios of projected',
                tmean: 'mean temperature change',
                tmin: 'minimum temperature change',
                tmax: 'maximum temperature change',
                precip: 'total precipitation change',
                link: 'http://climate-scenarios.canada.ca/?page=downscaling'
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
                    "En savoir plus sur les scénarios de mis à l'echelle de maniere statistique des changements projetés",
                tmean: 'variations de la température moyenne',
                tmin: 'variations de la température minimale ',
                tmax: 'variations de la température maximale',
                precip: 'variations des précipitations moyennes',
                link: 'http://scenarios-climatiques.canada.ca/index.php?page=downscaling'
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
