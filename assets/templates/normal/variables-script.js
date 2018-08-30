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
            station_name: '[fr] MSC station name',
            climate_value: '[fr] Climate value',
            measurement_type: '[fr] Measurement type',
            normal_period: '[fr] First-last year of normal period',
            period: '[fr] Period beginning-end',
            obs_count: '[fr] Total observations count',
            obs_percent: '[fr] Percentage of possible observations',
            date_calculated: '[fr] Date calculated',
            normal_code: '[fr] Normal code',
            month: '[fr] Month',
            time_of_year: {
                title: "Période de l'année",
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
                    "L'automne",
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
