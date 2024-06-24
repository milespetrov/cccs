var variableTemplate = {
    props: ['identifyData'],
    template:`
        <div class="cdv-details">

            <h4 class="h5 mrgn-tp-sm mrgn-bttm-sm">{{ identifyData.data.STATION_NAME }}</h4>
            <span class="sub-title mrgn-tp-sm mrgn-bttm-md">{{ TRANSLATIONS[lang].station_name }}</span>

            <span class="divider mrgn-bttm-md"></span>

            <dl>

                <dt>
                    <span>{{ TRANSLATIONS[lang].time_of_year.title }}</span>
                </dt>
                <dd>{{ TRANSLATIONS[lang].time_of_year.times[identifyData.data.MONTH - 1] }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].measurement_type }}</span>
                </dt>
                <dd v-if="lang === 'en'">{{ identifyData.data.E_NORMAL_ELEMENT_NAME }}</dd>
                <dd v-if="lang === 'fr'">{{ identifyData.data.F_NORMAL_ELEMENT_NAME }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].climate_value }}</span>
                </dt>
                <dd>{{ value }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].period }}</span>
                </dt>
                <dd>{{ identifyData.data.PERIOD_BEGIN }} - {{ identifyData.data.PERIOD_END }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].normal_period }}</span>
                </dt>
                <dd>{{ identifyData.data.FIRST_YEAR_NORMAL_PERIOD }} - {{ identifyData.data.LAST_YEAR_NORMAL_PERIOD }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].obs_count }}</span>
                </dt>
                <dd>{{ identifyData.data.TOTAL_OBS_COUNT }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].obs_percent }}</span>
                </dt>
                <dd>{{ identifyData.data.PERCENT_OF_POSSIBLE_OBS }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].date_calculated }}</span>
                </dt>
                <dd>{{ identifyData.data.DATE_CALCULATED }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].normal_code }}</span>
                </dt>
                <dd>{{ identifyData.data.NORMAL_CODE }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].climate_identifier }}</span>
                </dt>
                <dd>{{ identifyData.data.CLIMATE_IDENTIFIER }}</dd>
            </dl>

        </div>
    `,
    beforeMount() {
        this.lang = document.documentElement.lang;

        this.value = parseFloat(this.identifyData.data.VALUE).toFixed(1);
    },
    methods: {
    },
    data() {
        return {
            value: 0,
            TRANSLATIONS: {
                'en': {
                    station_name: 'MSC station name',
                    climate_value: 'Climate value',
                    measurement_type: 'Measurement type',
                    normal_period: 'First-last year of normal period',
                    period: 'Period beginning-end',
                    obs_count: 'Total observations count',
                    obs_percent: 'Percentage of possible observations',
                    date_calculated: 'Date calculated',
                    normal_code: 'Normal code',
                    climate_identifier: 'Climate identifier',
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
                'fr': {
                    station_name: 'Nom de la station du SMC',
                    climate_value: 'Valeur climatique',
                    measurement_type: 'Type de mesure',
                    normal_period: 'Première et dernière années de la période pour les normales',
                    period: 'Début et fin de la période',
                    obs_count: "Nombre total d'observations",
                    obs_percent: "Pourcentage d'observations possibles",
                    date_calculated: 'Date du calcul',
                    normal_code: 'Code de la normale',
                    climate_identifier: 'Identifiant climatique',
                    time_of_year: {
                        title: "Temps de l'année",
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
                            'Annuel'
                        ]
                    }
                }
            },
            lang: 'en'
        }
    }
};

var stationTemplate = {
    props: ['identifyData'],
    template:`
        <div class="cdv-details">

            <h4 class="h5 mrgn-tp-sm mrgn-bttm-sm">{{ identifyData.data.STATION_NAME }}</h4>
            <span class="sub-title mrgn-tp-sm mrgn-bttm-md">{{ TRANSLATIONS[lang].station_name }}</span>

            <span class="divider mrgn-bttm-md"></span>

            <dl>
                <dt>
                    <span>{{ TRANSLATIONS[lang].climate_identifier }}</span>
                </dt>
                <dd>{{ identifyData.data.CLIMATE_IDENTIFIER }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].tc_identifier }}</span>
                </dt>
                <dd>{{ identifyData.data.TC_IDENTIFIER || '-' }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].wmo_identifier }}</span>
                </dt>
                <dd>{{ identifyData.data.WMO_IDENTIFIER || '-' }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].station_operator }}</span>
                </dt>
                <dd v-if="lang === 'en'">{{ identifyData.data.ENG_STN_OPERATOR_NAME || '-' }}</dd>
                <dd v-if="lang === 'fr'">{{ identifyData.data.FRE_STN_OPERATOR_NAME || '-' }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].province }}</span>
                </dt>
                <dd v-if="lang === 'en'">{{ identifyData.data.ENG_PROV_NAME }}</dd>
                <dd v-if="lang === 'fr'">{{ identifyData.data.FRE_PROV_NAME }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].timezone }}</span>
                </dt>
                <dd>{{ identifyData.data.TIMEZONE }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].longitude }}</span>
                </dt>
                <dd>{{ long }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].latitude }}</span>
                </dt>
                <dd>{{ lat }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].elevation }}</span>
                </dt>
                <dd>{{ identifyData.data.ELEVATION }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].station_type }}</span>
                </dt>
                <dd>{{ identifyData.data.STATION_TYPE }}</dd>
            </dl>
        </div>
    `,
    methods: {
    },
    beforeMount() {
        this.lang = document.documentElement.lang;

        Object.keys(this.identifyData.data).forEach((key) => {
            if (typeof this.identifyData.data[key] === 'string') {
                this.identifyData.data[key] = this.identifyData.data[key].trim();
            }
        });

        this.long = this.identifyData.data.LONGITUDE / 10000000;
        this.lat = this.identifyData.data.LATITUDE / 10000000;
    },
    data() {
        return {
            long: 0,
            lat: 0,
            TRANSLATIONS: {
                'en': {
                    station_name: 'Station name',
                    station_type: 'Station type',
                    province: 'Province/Territory',
                    latitude: 'Latitude',
                    longitude: 'Longitude',
                    elevation: 'Elevation',
                    timezone: 'Time zone',
                    station_operator: 'Station operator',
                    tc_identifier: 'Transport Canada identifier',
                    wmo_identifier: 'WMO identifier',
                    climate_identifier: 'Climate identifier'
                },

                'fr': {
                    station_name: 'Nom de la station',
                    station_type: 'Type de station',
                    province: 'Province / Territoire',
                    latitude: 'Latitude',
                    longitude: 'Longitude',
                    elevation: 'Altitude',
                    timezone: 'Fuseau horaire',
                    station_operator: 'Opérateur de la station',
                    tc_identifier: 'Identifiant de Transports Canada',
                    wmo_identifier: "Identifiant de l'OMM",
                    climate_identifier: 'Identifiant climatique'
                }
            },
            lang: 'en'
        }
    }
};




export default function register(rampInstance) {
    rampInstance.$element.component('normalStationTemplate', stationTemplate);

    rampInstance.$element.component('normalVariableTemplate', variableTemplate);
}