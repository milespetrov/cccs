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
                tmin: 'Daily minimum temperature',
                tmax: 'Daily maximum temperature',
                precip: 'Total precipitation',
                gso: 'Growing season overwinter',
                gsc: 'Growing season cool',
                gsw: 'Growing season warm'
            },
            measurementUnit: {
                precip: '%',
                tmean: '°C',
                tmin: '°C',
                tmax: '°C',
                gso: 'days',
                gsc: 'days',
                gsw: 'days'
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
                default: 'Learn more about the Statistically downscaled climate data dataset.',
                link: 'https://www.canada.ca/en/environment-climate-change/services/climate-change/canadian-centre-climate-services/display-download/technical-documentation-downscaled-climate-scenarios.html'
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
                tmin: 'Température minimale quotidienne',
                tmax: 'Température maximale quotidienne',
                precip: 'Précipitations totales',
                gso: 'Growing season overwinter [FR]',
                gsc: 'Growing season cool [FR]',
                gsw: 'Growing season warm [FR]'
            },
            measurementUnit: {
                precip: '%',
                tmean: '°C',
                tmin: '°C',
                tmax: '°C',
                gso: 'jours',
                gsc: 'jours',
                gsw: 'jours'
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
                default:
                    "En savoir plus sur l’ensemble de données Scénarios climatiques mis à l’échelle de manière statistique.",
                link: 'https://www.canada.ca/fr/environnement-changement-climatique/services/changements-climatiques/centre-canadien-services-climatiques/afficher-telecharger/documentation-technique-scenarios-climatiques-echelle-reduite.html'
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

    result.latlong = window.RAMP.GAPI.proj.localProjectPoint(3978, 4326, data.features[0].geometry.coordinates);

    result.tt = TRANSLATIONS[lang];

    return result;
}
