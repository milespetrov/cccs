function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            stationId: 'MSC station ID',
            climate_value: 'Climate value',
            measurement_type: 'Measurement type',
            normal_period: 'First-last year of normal period',
            period: 'Period beginning-end',
            obs_count: 'Total observations count',
            obs_percent: 'Percentage of possible observations',
            date_calculated: 'Date calculated',
            normal_code: 'Normal code',
            month: 'Month'
        },

        'fr-CA': {}
    };

    console.log(data, lang);

    data.properties = {};

    data.forEach(function(el) {
        data.properties[el.key] = el.value;
    });
    data.tt = TRANSLATIONS[lang];

    return data;
}
