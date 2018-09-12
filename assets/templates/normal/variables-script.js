function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            station_name: 'MSC station name',
            climate_value: 'Climate value',
            measurement_type: 'Measurement type',
            normal_period: 'First-last year of normal period',
            period: 'Period beginning-end',
            obs_count: 'Total observations count',
            obs_percent: 'Percentage of possible observations',
            date_calculated: 'Date calculated',
            normal_code: 'Normal code',
            time_of_year: {
                title: 'Time of year',
                times: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                    'Annual'
                ]
            }
        },

        'fr-CA': {
            station_name: 'Nom de la station du SMC',
            climate_value: 'Valeur climatique',
            measurement_type: 'Type de mesure',
            normal_period: 'Prmière et dernière années de la période pour les normales',
            period: 'Début et fin de la période',
            obs_count: "Nombre total d'observations",
            obs_percent: "Pourcentage d'observations possibles",
            date_calculated: 'Date du calcul',
            normal_code: 'Code de la normale',
            time_of_year: {
                title: "Temps de l'année",
                times: [
                    'Janvier',
                    'Février',
                    'Mars',
                    'Avril',
                    'Mai',
                    'Juin',
                    'Juillet',
                    'Août',
                    'Septembre',
                    'Octobre',
                    'Novembre',
                    'Décembre',
                    'Hiver',
                    'Printemps',
                    'Été',
                    'Automne',
                    'Annuel'
                ]
            }
        }
    };

    console.log(data, lang);

    data.properties = {};
    data.tt = TRANSLATIONS[lang];

    data.forEach(function(el) {
        data.properties[el.key] = el.value;
    });

    return data;
}
