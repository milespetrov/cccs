function parser(data, lang) {
    const TRANSLATIONS = {
        'en-CA': {
            station_name: 'Virtual Station Name',
            climate_identifier: 'Climate Identifier:',
            data_source: 'Type:',
            element_name: 'Element:',
            period: 'Period:',
            time_separator: ' to ',
            present: 'Present'
        },

        'fr-CA': {
            station_name: 'Nom du Station Virtuelle',
            climate_identifier: 'Identifiant Climatologique',
            data_source: 'Type:',
            element_name: 'Élément:',
            period: 'Période:',
            time_separator: ' à ',
            present: 'Présent'
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
        data.properties.END_DATE = TRANSLATIONS[lang].present;
    } else {
        data.properties.END_DATE = data.properties.END_DATE.split('T')[0];
    }

    if (data.properties.ELEMENT_NAME_E.includes('SNOW')) {
        data.properties.ELEMENT_NAME_F = "Chute de neige totale quotidienne";
    } else if (data.properties.ELEMENT_NAME_E.includes('PRECIP')) {
        data.properties.ELEMENT_NAME_F = "Précipitation totale quotidienne";
    } else if (data.properties.ELEMENT_NAME_E.includes("MAX")) {
        data.properties.ELEMENT_NAME_F = "Température maximale quotidienne";
    } else {
        data.properties.ELEMENT_NAME_F = "Température minimale quotidienne";
    }

    if (!data.properties.FRE_STN_NAME || data.properties.FRE_STN_NAME === "" || data.properties.FRE_STN_NAME.toLowerCase() === 'none'){
        data.properties.FRE_STN_NAME = data.properties.ENG_STN_NAME;
    }

    data.lang = lang;

    data.tt = TRANSLATIONS[lang];

    return data;
}
