function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            latlong: 'Latitude, longitude',
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
                snd: 'snow depth change',
                link: 'http://climate-scenarios.canada.ca/?page=technical-notes'
            }
        },

        'fr-CA': {
            latlong: 'Latitude, longitude',
            trendValue: {
                default: 'Changements projetés des moyennes sur 20 ans',
                tmean: 'température moyenne (degrés Celsius)',
                sic: 'concentration de la glace de mer (%)',
                sit: 'épaisseur de la glace de mer (%)',
                precip: 'précipitations moyennes (%)',
                sfcwind: 'vitesse du vent (%)',
                snd: 'épaisseur de la neige (%)'
            },
            learnMore: {
                default: 'En savoir plus sur les changements projetés',
                tmean: 'variation de la température moyenne',
                precip: 'variations des précipitations moyennes',
                sic: 'variation de la concentration des glaces de mer',
                sit: "variation de l'épaisseur de la glace de mer",
                sfcwind: 'variation de la vitesse du vent',
                snd: "variation de l'épaisseur de la neige",
                link: 'http://scenarios-climatiques.canada.ca/index.php?page=technical-notes'
            }
        }
    };

    if (typeof data === 'undefined') {
        return null;
    }

    var result = {};

    result.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];

    var tempVal = data.features[0].properties.value;
    var parsedVal = parseFloat(tempVal).toFixed(2); // seems to not error if gargabe is passed in

    result.value = isNaN(parsedVal) ? tempVal : parsedVal;
    result.latlong = window.RZ.GAPI.proj.localProjectPoint(3978, 4326, data.features[0].geometry.coordinates);

    result.tt = TRANSLATIONS[lang];

    return result;
}
