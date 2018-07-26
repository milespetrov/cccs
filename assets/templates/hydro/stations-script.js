function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            station_name: 'Station Name',
            station_number: 'Station Number',
            contributor: 'Contributor',
            vertical_datum: 'Vertical Datum',
            status: 'Status',
            province: {
                title: 'Province',
                AB: 'Alberta',
                BC: 'British Columbia',
                MB: 'Manitoba',
                NB: 'New Brunswick',
                NL: 'Newfoundland and Labrador',
                NS: 'Nova Scotia',
                NT: 'Northwest Territories',
                NU: 'Nunavut',
                ON: 'Ontario',
                PE: 'Prince Edward Island',
                QC: 'Quebec',
                SK: 'Saskatchewan',
                YT: 'Yukon'
            }
        },

        'fr-CA': {}
    };

    data.properties = {};

    data.forEach(function(el) {
        if (typeof el.value === 'string') {
            el.value = el.value.trim();
        }
        data.properties[el.key] = el.value;
    });

    data.lang = lang;

    data.tt = TRANSLATIONS[lang];

    return data;
}
