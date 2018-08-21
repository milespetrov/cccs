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
            month: 'Month',
            annual: 'Annual'
        },

        'fr-CA': {
            annual: 'Annuel'
        }
    };

    console.log(data, lang);

    data.properties = {};
    data.tt = TRANSLATIONS[lang];

    data.forEach(function(el) {
        if (el.key === 'MONTH' && el.value === 13) {
            data.properties[el.key] = data.tt.annual;
        } else {
            data.properties[el.key] = el.value;
        }
    });

    return data;
}
