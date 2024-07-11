var variableTemplate = {
    props: ['identifyData'],
    template: `
        <div class="cdv-details">

            <h4 class="h5 mrgn-tp-sm mrgn-bttm-sm">{{ identifyData.data.VIRTUAL_STATION_NAME_E }}, {{ record_begin }}{{ TRANSLATIONS[lang].time_separator }}{{ record_end }}</h4>
            <span class="sub-title mrgn-tp-sm mrgn-bttm-md">{{ TRANSLATIONS[lang].station_name }}</span>

            <span class="divider mrgn-bttm-md"></span>

            <dl>
                <dt v-if="variable !== 'precip' && variable !== 'snd'">
                    <span>{{ TRANSLATIONS[lang].last_updated }}</span>
                </dt>
                <dd v-if="variable !== 'precip' && variable !== 'snd'">{{ identifyData.data.LAST_UPDATED }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].date }}</span>
                </dt>
                <dd v-if="lang === 'en'">{{ TRANSLATIONS[lang].months[identifyData.data.LOCAL_MONTH - 1]}} {{ identifyData.data.LOCAL_DAY }}</dd>
                <dd v-if="lang === 'fr'">{{ identifyData.data.LOCAL_DAY }} {{ TRANSLATIONS[lang].months[identifyData.data.LOCAL_MONTH - 1]}}</dd>
                
                <dt>
                    <span>{{ TRANSLATIONS[lang].record_type }}</span>
                </dt>
                <dd>{{ TRANSLATIONS[lang].record_types[variable] }}</dd>
                
                <dt>
                    <span>{{ TRANSLATIONS[lang].first_value }}</span>
                </dt>
                <dd>{{ first_value }}{{ TRANSLATIONS[lang].units[variable] }} ({{ first_year }})</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].second_value }}</span>
                </dt>
                <dd>{{ second_value }}{{ TRANSLATIONS[lang].units[variable] }} ({{ second_year }})</dd>
                
                <dt>
                    <span>{{ TRANSLATIONS[lang].third_value }}</span>
                </dt>
                <dd>{{ third_value }}{{ TRANSLATIONS[lang].units[variable] }} ({{ third_year }})</dd>
                
                <dt>
                    <span>{{ TRANSLATIONS[lang].fourth_value }}</span>
                </dt>
                <dd>{{ fourth_value }}{{ TRANSLATIONS[lang].units[variable] }} ({{ fourth_year }})</dd>
                
                <dt>
                    <span>{{ TRANSLATIONS[lang].fifth_value }}</span>
                </dt>
                <dd>{{ fifth_value }}{{ TRANSLATIONS[lang].units[variable] }} ({{ fifth_year }})</dd>
            </dl>
        </div>
    `,
    beforeMount() {
        this.parseData();
    },
    beforeUpdate() {
        this.parseData();
    },
    methods: {
        parseData() {
            this.lang = document.documentElement.lang;

            this.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];

            Object.keys(this.identifyData.data).forEach((key) => {
                if (typeof this.identifyData.data[key] === 'string') {
                    this.identifyData.data[key] = this.identifyData.data[key].trim();
                }
            });

            if (this.identifyData.data['LAST_UPDATED']) {
                this.identifyData.data['LAST_UPDATED'] = this.identifyData.data['LAST_UPDATED'].split('T')[0];
            }

            const mappings = {
                'tmaxh': 'HIGH_MAX_TEMP',
                'tmaxl': 'LOW_MAX_TEMP',
                'tminh': 'HIGH_MIN_TEMP',
                'tminl': 'LOW_MIN_TEMP',
                'precip': 'PRECIPITATION',
                'snd': 'SNOWFALL'
            }
            const mappings2 = {
                'tmaxh': 'MAX_TEMP_',
                'tmaxl': 'MAX_TEMP_',
                'tminh': 'MIN_TEMP_',
                'tminl': 'MIN_TEMP_',
                'precip': '',
                'snd': '',
            }

            this.record_begin = this.identifyData.data[mappings2[this.variable] + 'RECORD_BEGIN'].split('T')[0];
            this.record_end = this.identifyData.data[mappings2[this.variable] + 'RECORD_END'];
            if (!this.record_end) {
                this.record_end = this.TRANSLATIONS[this.lang].present;
            } else {
                this.record_end = this.record_end.split('T')[0];
            }
            this.first_value = this.identifyData.data['FIRST_' + mappings[this.variable]];
            this.second_value = this.identifyData.data['SECOND_' + mappings[this.variable]];
            this.third_value = this.identifyData.data['THIRD_' + mappings[this.variable]];
            this.fourth_value = this.identifyData.data['FOURTH_' + mappings[this.variable]];
            this.fifth_value = this.identifyData.data['FIFTH_' + mappings[this.variable]];
            this.first_year = this.identifyData.data['FIRST_' + mappings[this.variable] + '_YEAR'];
            this.second_year = this.identifyData.data['SECOND_' + mappings[this.variable] + '_YEAR'];
            this.third_year = this.identifyData.data['THIRD_' + mappings[this.variable] + '_YEAR'];
            this.fourth_year = this.identifyData.data['FOURTH_' + mappings[this.variable] + '_YEAR'];
            this.fifth_year = this.identifyData.data['FIFTH_' + mappings[this.variable] + '_YEAR'];
        }

    },
    data() {
        return {
            variable: '',
            record_begin: '',
            record_end: '',
            first_value: '',
            second_value: '',
            third_value: '',
            fourth_value: '',
            fifth_value: '',
            first_year: '',
            second_year: '',
            third_year: '',
            fourth_year: '',
            fifth_year: '',
            TRANSLATIONS: {
                'en': {
                    station_name: 'Virtual Station Name, Period of Record',
                    date: 'Date of Year',
                    record_type: 'Record Type',
                    first_value: 'Extreme Value (Year)',
                    second_value: '2nd Extreme Value (Year)',
                    third_value: '3rd Extreme Value (Year)',
                    fourth_value: '4th Extreme Value (Year)',
                    fifth_value: '5th Extreme Value (Year)',
                    last_updated: 'Last Updated',
                    time_separator: ' to ',
                    present: 'Present',
                    months: [
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
                    ],
                    record_types: {
                        'tmaxh': 'Record High Maximum Temperature',
                        'tmaxl': 'Record Low Maximum Temperature',
                        'tminh': 'Record High Minimum Temperature',
                        'tminl': 'Record Low Minimum Temperature',
                        'snd': 'Record Snowfall',
                        'precip': 'Record Precipitation'
                    },
                    units: {
                        'tmaxh': '°C',
                        'tmaxl': '°C',
                        'tminh': '°C',
                        'tminl': '°C',
                        'precip': 'mm',
                        'snd': 'cm'
                    }
                },

                'fr': {
                    station_name: 'Nom du Station Virtuelle, Période d’enregistrement',
                    date: 'Jour de l\'année',
                    record_type: 'Type d\'enregistrement',
                    first_value: 'Extrême (Année)',
                    second_value: '2e Extrême (Année)',
                    third_value: '3e Extrême (Année)',
                    fourth_value: '4e Extrême (Année)',
                    fifth_value: '5e Extrême (Année)',
                    last_updated: 'Dernière mise à jour',
                    time_separator: ' à ',
                    present: 'Présent',
                    months: [
                        'janvier',
                        'février',
                        'mars',
                        'avril',
                        'mai',
                        'juin',
                        'juillet',
                        'août',
                        'septembre',
                        'octobre',
                        'novembre',
                        'décembre'
                    ],
                    record_types: {
                        'tmaxh': 'Record de Température Maximale la plus élevée',
                        'tmaxl': 'Record de Température Maximale la plus basse',
                        'tminh': 'Record de Température Minimale la plus élevée',
                        'tminl': 'Record de Température Minimale la plus basse',
                        'snd': 'Records de Précipitations de Neige',
                        'precip': 'Records de Précipitations'
                    },
                    units: {
                        'tmaxh': '°C',
                        'tmaxl': '°C',
                        'tminh': '°C',
                        'tminl': '°C',
                        'precip': 'mm',
                        'snd': 'cm'
                    }
                }
            },
            lang: 'en'
        }
    }
};

var stationTemplate = {
    props: ['identifyData'],
    template: `
        <div class="cdv-details">

            <h4 v-if="lang === 'en'" class="h5 mrgn-tp-sm mrgn-bttm-sm">{{ identifyData.data.VIRTUAL_STATION_NAME_E }}</h4>
            <h4 v-if="lang === 'fr'" class="h5 mrgn-tp-sm mrgn-bttm-sm">{{ identifyData.data.VIRTUAL_STATION_NAME_F }}</h4>
            <span class="sub-title mrgn-tp-sm mrgn-bttm-md">{{ TRANSLATIONS[lang].station_name }}</span>

            <span class="divider mrgn-bttm-md"></span>

            <p style="font-weight: bold;" v-if="lang === 'en'">{{ identifyData.data.ENG_STN_NAME }}</p>
            <p style="font-weight: bold;" v-if="lang === 'fr'">{{ identifyData.data.FRE_STN_NAME }}</p>
            <p>{{ TRANSLATIONS[lang].climate_identifier }} <span style="font-weight: bold;">{{ identifyData.data.CLIMATE_IDENTIFIER }}</span></p>
            <p>{{ TRANSLATIONS[lang].period }} <span style="font-weight: bold;">{{ identifyData.data.START_DATE }} to {{ identifyData.data.END_DATE }}</span></p>
            <p>{{ TRANSLATIONS[lang].data_source }} <span style="font-weight: bold;">{{ identifyData.data.DATA_SOURCE }}</span></p>
            <p>{{ TRANSLATIONS[lang].element_name }} <span style="font-weight: bold;" v-if="lang === 'en'">{{ identifyData.data.ELEMENT_NAME_E }}</span><span style="font-weight: bold;" v-if="lang === 'fr'">{{ ELEMENT_NAME_F }}</span></p>
        </div>
    `,
    methods: {
        parseData() {
            this.lang = document.documentElement.lang;

            Object.keys(this.identifyData.data).forEach((key) => {
                if (typeof this.identifyData.data[key] === 'string') {
                    this.identifyData.data[key] = this.identifyData.data[key].trim();
                }
            });

            this.identifyData.data.START_DATE = this.identifyData.data.START_DATE.split('T')[0];
            if (!this.identifyData.data.END_DATE) {
                this.identifyData.data.END_DATE = this.TRANSLATIONS[this.lang].present;
            } else {
                this.identifyData.data.END_DATE = this.identifyData.data.END_DATE.split('T')[0];
            }

            if (this.identifyData.data.ELEMENT_NAME_E.includes('SNOW')) {
                this.ELEMENT_NAME_F = "Chute de neige totale quotidienne";
            } else if (this.identifyData.data.ELEMENT_NAME_E.includes('PRECIP')) {
                this.ELEMENT_NAME_F = "Précipitation totale quotidienne";
            } else if (this.identifyData.data.ELEMENT_NAME_E.includes("MAX")) {
                this.ELEMENT_NAME_F = "Température maximale quotidienne";
            } else {
                this.ELEMENT_NAME_F = "Température minimale quotidienne";
            }

            if (!this.identifyData.data.FRE_STN_NAME || this.identifyData.data.FRE_STN_NAME === "" || this.identifyData.data.FRE_STN_NAME.toLowerCase() === 'none') {
                this.identifyData.data.FRE_STN_NAME = this.identifyData.data.ENG_STN_NAME;
            }
        }
    },
    async beforeMount() {
        this.parseData();
    },
    async beforeUpdate() {
        this.parseData();
    },
    data() {
        return {
            ELEMENT_NAME_F: '',
            TRANSLATIONS: {
                'en': {
                    station_name: 'Virtual Station Name',
                    climate_identifier: 'Climate Identifier:',
                    data_source: 'Type:',
                    element_name: 'Element:',
                    period: 'Period:',
                    time_separator: ' to ',
                    present: 'Present'
                },
                'fr': {
                    station_name: 'Nom du Station Virtuelle',
                    climate_identifier: 'Identifiant Climatologique',
                    data_source: 'Type:',
                    element_name: 'Élément:',
                    period: 'Période:',
                    time_separator: ' à ',
                    present: 'Présent'
                }
            },
            lang: 'en'
        }
    }
};




export default function register(rampInstance) {
    rampInstance.$element.component('ltceStationTemplate', stationTemplate);

    rampInstance.$element.component('ltceVariableTemplate', variableTemplate);
}