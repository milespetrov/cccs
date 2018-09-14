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
                default: 'Learn more about',
                tmean: 'homogenized mean temperature',
                tmin: 'homogenized minimum temperature',
                tmax: 'homogenized maximum temperature',
                precip: 'adjusted total precipitation',
                sfcwind: 'homogenized wind speed',
                stnpress: 'homogenized station pressure',
                seapress: 'homogenized sea level pressure',
                link: 'https://open.canada.ca/data/en/dataset/9c4ebc00-3ea4-4fe0-8bf2-66cfe1cddd1d'
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
                default: 'En savoir plus sur',
                tmean: 'température moyenne homogénéisée',
                tmin: 'température minimale homogénéisée',
                tmax: 'température maximale homogénéisée',
                precip: 'précipitations totales ajustées',
                sfcwind: 'vitesse du vent homogénéisée',
                stnpress: 'pression homogénéisée à la station',
                seapress: 'pression au niveau de la mer homogénéisée ',
                link: 'https://ouvert.canada.ca/data/fr/dataset/9c4ebc00-3ea4-4fe0-8bf2-66cfe1cddd1d'
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
