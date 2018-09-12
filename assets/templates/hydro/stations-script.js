function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            station_name: 'Station Name',
            station_number: 'Station Number',
            contributor: 'Contributor',
            vertical_datum: 'Vertical Datum',
            status: 'Status',
            province: {
                title: 'Province / Territory',
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

        'fr-CA': {
            station_name: 'Nom de la station',
            station_number: 'Numéro de la station',
            contributor: 'Contributeur',
            vertical_datum: 'Plan de référence altimétrique',
            status: 'Statut',
            province: {
                title: 'Province / Territoire',
                AB: 'Alberta',
                BC: 'Colombie-Britannique',
                MB: 'Manitoba',
                NB: 'Nouveau-Brunswick',
                NL: 'Terre-Neuve-et-Labrador',
                NS: 'Nouvelle-Écosse',
                NT: 'Territoires du Nord-Ouest',
                NU: 'Nunavut',
                ON: 'Ontario',
                PE: 'Île-du-Prince-Édouard',
                QC: 'Québec',
                SK: 'Saskatchewan',
                YT: 'Yukon'
            }
        }
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
