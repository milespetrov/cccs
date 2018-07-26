function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            stationId: 'MSC station ID',
            climateValue: 'Climate value',
            measurementType: 'Measurement type',
            timePeriod: 'Normal period'
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
