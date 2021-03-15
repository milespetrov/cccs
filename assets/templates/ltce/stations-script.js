function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            station_name: 'Virtual Station Name',
            climate_identifier: 'Climate Identifier:',
            data_source: 'Type:',
            element_name: 'Element:',
            period: 'Period:',
            time_separator: ' to '
        },

        'fr-CA': {
            station_name: 'Virtual Station Name [fr]',
            climate_identifier: 'Climate Identifier: [fr]',
            data_source: 'Type: [fr]',
            element_name: 'Element: [fr]',
            period: 'Period: [fr]',
            time_separator: ' a [fr]'
        }
    };

    data.properties = {};

    data.forEach(function(el) {
        if (typeof el.value === 'string') {
            el.value = el.value.trim();
        }
        data.properties[el.key] = el.value;
    });

    data.properties.START_DATE = data.properties.START_DATE.split('T')[0];
    if (!data.properties.END_DATE) {
        data.properties.END_DATE = 'Present'; //TODO: FRENCH
    } else {
        data.properties.END_DATE = data.properties.END_DATE.split('T')[0];
    }

    data.lang = lang;

    data.tt = TRANSLATIONS[lang];

    console.log(data);

    return data;
}
