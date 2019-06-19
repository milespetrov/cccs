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
                default: 'Learn more about the Global climate model scenarios dataset.',
                link: 'https://www.canada.ca/en/environment-climate-change/services/climate-change/canadian-centre-climate-services/display-download/technical-documentation-coupled-model-intercomparison-phase5.html'
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
                default: 'En savoir plus sur l’ensemble de données Scénarios basés sur des modèles climatiques globaux.',
                link: 'https://www.canada.ca/fr/environnement-changement-climatique/services/changements-climatiques/centre-canadien-services-climatiques/afficher-telecharger/documentation-technique-phase5-intercomparaison-modeles-couples.html'
            }
        }
    };

    if (typeof data === 'undefined') {
        return null;
    }

    var result = {};

    result.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];

    var tempVal = data.features[0].properties.value;
    var parsedVal = parseFloat(tempVal).toFixed(1); // seems to not error if gargabe is passed in

    result.value = isNaN(parsedVal) ? tempVal : parsedVal;
    result.latlong = window.RZ.GAPI.proj.localProjectPoint(3978, 4326, data.features[0].geometry.coordinates);

    result.tt = TRANSLATIONS[lang];

    return result;
}
