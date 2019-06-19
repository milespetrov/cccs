function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            stationId: 'AHCCD station ID',
            trendValue: 'Trend value',
            no_trend: 'No trend calculated',
            elevation: 'Elevation',
            province: 'Province/Territory',
            measurementUnit: {
                total_precip: 'mm',
                temp_mean: '°C',
                temp_max: '°C',
                temp_min: '°C',
                wind_speed: 'km/h',
                pressure_station: 'kPa',
                pressure_sea_level: 'kPa'
            },
            yearRange: 'Trend period',
            noYearRange: 'No trend period',
            timePeriod: {
                title: 'Time period',
                Jan: 'January',
                Feb: 'February',
                Mar: 'March',
                Apr: 'April',
                May: 'May',
                Jun: 'June',
                Jul: 'July',
                Aug: 'August',
                Sep: 'September',
                Oct: 'October',
                Nov: 'November',
                Dec: 'December',
                Win: 'Winter',
                Spr: 'Spring',
                Smr: 'Summer',
                Fal: 'Autumn',
                Ann: 'Annual'
            },
            learnMore: {
                default: 'Learn more about Adjusted and Homogenized Canadian Climate Data (AHCCD) dataset.',
                link: 'https://www.canada.ca/en/environment-climate-change/services/climate-change/canadian-centre-climate-services/display-download/technical-documentation-adjusted-climate-data.html'
            }
        },

        'fr-CA': {
            stationId: 'Numéro de la station DCCAH',
            trendValue: 'Valeur de la tendance',
            no_trend: 'Aucune tendance calculée',
            elevation: 'Altitude',
            province: 'Province / Territoire',
            measurementUnit: {
                total_precip: 'mm',
                temp_mean: '°C',
                temp_max: '°C',
                temp_min: '°C',
                wind_speed: 'km/h',
                pressure_station: 'kPa',
                pressure_sea_level: 'kPa'
            },
            yearRange: 'Période de tendance',
            noYearRange: 'Aucune période de tendance',
            timePeriod: {
                title: 'Période',
                Jan: 'Janvier',
                Feb: 'Février',
                Mar: 'Mars',
                Apr: 'Avril',
                May: 'Mai',
                Jun: 'Juin',
                Jul: 'Juillet',
                Aug: 'Août',
                Sep: 'Septembre',
                Oct: 'Octobre',
                Nov: 'Novembre',
                Dec: 'Décembre',
                Win: 'Hiver',
                Spr: 'Printemps',
                Smr: 'Été',
                Fal: 'Automne',
                Ann: 'Annuel'
            },
            learnMore: {
                default: 'En savoir plus sur l’ensemble de données climatiques canadiennes ajustées et homogénéisées (DCCAH).',
                link: 'https://www.canada.ca/fr/environnement-changement-climatique/services/changements-climatiques/centre-canadien-services-climatiques/afficher-telecharger/documentation-technique-donnees-climatiques-ajustees.html'
            }
        }
    };

    data.properties = {};

    data.properties.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];

    data.forEach(function(el) {
        if (el.key === 'trend_value__valeur_tendance') {
            // round the trend value. if not parsable, keep orig value.
            var parsedVal = parseFloat(el.value).toFixed(1); // seems to not error if gargabe is passed in
            if (!isNaN(parsedVal)) {
                el.value = parsedVal;
            }
        }
        data.properties[el.key] = el.value;
    });
    data.tt = TRANSLATIONS[lang];

    if (data.properties.trend_value__valeur_tendance) {
        if (parseFloat(data.properties.trend_value__valeur_tendance) > 0) {
            data.properties.trend_prefix = '+';
        }
    }

    return data;
}
