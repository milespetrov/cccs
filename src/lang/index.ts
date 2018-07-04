import Vue from 'vue';
import VueI18n from 'vue-i18n';

import Page from '@/page-values';

Vue.use(VueI18n);

type csvRows = { key: string; enValue: string; frValue: string }[];
interface LocaleMessages {
    [key: string]: { [name: string]: string };
}

const rows = require('./lang.csv');

/**
 * Fold the imported CSV file in the form of `{ key: string, enValue: string, frValue: string }[]` to the form understood by VueI18n: `{ en: { [name: string]: string }, fr: { [name: string]: string } }`.
 *
 * @param {csvRows} rows
 * @returns {LocaleMessages}
 */
function fold(rows: csvRows): LocaleMessages {
    return rows.reduce(
        (map, item) => {
            map.en[item.key] = item.enValue;
            map.fr[item.key] = item.frValue;
            return map;
        },
        { en: {}, fr: {} } as LocaleMessages
    );
}

const i18n = new VueI18n({
    locale: Page.lang,
    fallbackLocale: 'en',
    messages: fold(rows)
});

export { i18n };
