function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            latlong: 'Latitude, longitude',
            timePeriod: {
                label: 'Time of year',
                annual: 'Annual',
                spring: 'Spring',
                summer: 'Summer',
                fall: 'Autumn',
                winter: 'Winter'
            },
            variable: {
                label: 'Variable',
                tmean: 'Mean temperature',
                sic: 'Sea ice concentration',
                sit: 'Sea ice thickness',
                precip: 'Total precipitation',
                sfcwind: 'Surface wind speed',
                snd: 'Snow depth'
            },
            measurementUnit: {
                precip: '%',
                tmean: '°C',
                sfcwind: '%',
                sic: '%',
                sit: '%',
                snd: '%'
            },
            timeSlider: [
                '2021-2040',
                '2041-2060',
                '2061-2080',
                '2081-2100'
            ],
            rcp: {
                label: 'Emission scenario',
                rcp85: 'High',
                rcp45: 'Moderate',
                rcp26: 'Low'
            },
            learnMore: {
                default: 'Learn more about the Global climate model scenarios dataset.',
                link: 'https://www.canada.ca/en/environment-climate-change/services/climate-change/canadian-centre-climate-services/display-download/technical-documentation-coupled-model-intercomparison-phase5.html'
            },
            details: [
                'Projected change of',
                'by',
                'at'
            ],
            baseline: 'The projected change is relative to the 1986-2005 average.'
        },

        'fr-CA': {
            latlong: 'Latitude, longitude',
            timePeriod: {
                label: "Temps de l'année",
                annual: 'Annuel',
                spring: 'Printemps',
                summer: 'Été',
                fall: 'Automne',
                winter: 'Hiver'
            },
            variable: {
                label: 'Variable',
                tmean: 'Température moyenne',
                sic: 'Concentration de la glace de mer',
                sit: 'Épaisseur de la glace de mer',
                precip: 'Précipitations totales',
                sfcwind: 'Vitesse du vent',
                snd: 'Épaisseur de la neige'
            },
            measurementUnit: {
                precip: '%',
                tmean: '°C',
                sfcwind: '%',
                sic: '%',
                sit: '%',
                snd: '%'
            },
            timeSlider: [
                '2021-2040',
                '2041-2060',
                '2061-2080',
                '2081-2100'
            ],
            rcp: {
                label: "Scénarios d'émissions",
                rcp85: 'Élevées',
                rcp45: 'Modérées',
                rcp26: 'Faibles'
            },
            learnMore: {
                default: 'En savoir plus sur l’ensemble de données Scénarios basés sur des modèles climatiques globaux.',
                link: 'https://www.canada.ca/fr/environnement-changement-climatique/services/changements-climatiques/centre-canadien-services-climatiques/afficher-telecharger/documentation-technique-phase5-intercomparaison-modeles-couples.html'
            },
            details: [
                'Changement projeté de',
                'par',
                'à'
            ],
            baseline: 'Les changements projetés sont relatives à la moyenne de 1986-2005.'
        }
    };

    if (typeof data === 'undefined') {
        return null;
    }

    var result = {};

    result.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];
    result.timeSlice = new RegExp('[?&]ts=([0-9])').exec(window.location.href)[1];
    result.timePeriod = new RegExp('[?&]t=([^&]*)').exec(window.location.href)[1];
    result.rcp = new RegExp('[?&]r=(rcp[^&]*)').exec(window.location.href)[1];

    var tempVal = data.features[0].properties.value;
    var parsedVal = parseFloat(tempVal).toFixed(1); // seems to not error if gargabe is passed in
    if (!isNaN(parsedVal)){
        result.value = ((parsedVal >= 0) ? '+' : '') + parsedVal;
    } else {
        result.value = tempVal;
    }

    result.latlong = window.RZ.GAPI.proj.localProjectPoint(3978, 4326, data.features[0].geometry.coordinates);

    result.tt = TRANSLATIONS[lang];

    return result;
}
