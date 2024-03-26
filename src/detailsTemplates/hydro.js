var stationTemplate = {
    props: ['identifyData'],
    template:`
        <div class="cdv-details">

            <h4 class="h5 mrgn-tp-sm mrgn-bttm-sm">{{ identifyData.data.STATION_NAME }}</h4>
            <span class="sub-title mrgn-tp-sm mrgn-bttm-md">{{ TRANSLATIONS[lang].station_name }}</span>

            <span class="divider mrgn-bttm-md"></span>

            <dl>
                <dt>
                    <span>{{ TRANSLATIONS[lang].station_number }}</span>
                </dt>
                <dd>{{ identifyData.data.STATION_NUMBER }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].status }}</span>
                </dt>
                <dd v-if="lang === 'en'">{{ identifyData.data.STATUS_EN }}</dd>
                <dd v-if="lang === 'fr'">{{ identifyData.data.STATUS_FR }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].contributor }}</span>
                </dt>
                <dd v-if="lang === 'en'">{{ identifyData.data.CONTRIBUTOR_EN }}</dd>
                <dd v-if="lang === 'fr'">{{ identifyData.data.CONTRIBUTOR_FR }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].province.title }}</span>
                </dt>
                <dd>{{ TRANSLATIONS[lang].province[identifyData.data.PROV_TERR_STATE_LOC] }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].vertical_datum }}</span>
                </dt>
                <dd>{{ identifyData.data.VERTICAL_DATUM }}</dd>
            </dl>
        </div>
    `,
    methods: {
    },
    beforeMount(){
        this.lang = document.documentElement.lang;

        this.identifyData.data.forEach(function(el) {
        if (typeof el.value === 'string') {
            el.value = el.value.trim();
        }
    });
    },
    data() {
        return {
            TRANSLATIONS: {
                'en': {
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

                'fr': {
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
            },
            lang: 'en'
        }
    }
};

export default function register(rampInstance) {
    rampInstance.$element.component('hydroStationTemplate', stationTemplate);
}