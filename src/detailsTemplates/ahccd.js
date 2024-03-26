var variableTemplate = {
    props: ['identifyData'],
    template:`
        <div class="cdv-details">
            <dl>
                <dt>
                    <span>{{ TRANSLATIONS[lang].timePeriod.title }}</span>
                </dt>
                <dd>{{ TRANSLATIONS[lang].timePeriod[identifyData.data.period__periode] }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].yearRange }}</span>
                </dt>
                <dd v-if="identifyData.data.year_range__annees"> {{ identifyData.data.year_range__annees }}</dd>
                <dd v-if="!identifyData.data.year_range__annees"> {{ TRANSLATIONS[lang].noYearRange }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].trendValue }}</span>
                </dt>
                <dd v-if="identifyData.data.trend_value__valeur_tendance">{{ trendPrefix }}{{ trendVal
                    }} {{ TRANSLATIONS[lang].measurementUnit[identifyData.data.measurement_type__type_mesure] }}
                </dd>
                <dd v-if="!identifyData.data.trend_value__valeur_tendance">{{ TRANSLATIONS[lang].no_trend }}</dd>
            </dl>

            <span class="divider mrgn-bttm-md"></span>

            <dl>
                <dt>
                    <span>{{ TRANSLATIONS[lang].province }}</span>
                </dt>
                <dd>{{ identifyData.data.province__province }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].elevation }}</span>
                </dt>
                <dd>{{ identifyData.data.elevation__elevation }} m</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].stationId }}</span>
                </dt>
                <dd>{{ identifyData.data.station_id__id_station }}</dd>
            </dl>

            <a :href='TRANSLATIONS[lang].learnMore.link' target=_blank>{{ TRANSLATIONS[lang].learnMore.default }}</a>
        </div>
    `,
    beforeMount() {
        this.lang = document.documentElement.lang;

        var parsedVal = parseFloat(this.identifyData.data['trend_value__valeur_tendance']).toFixed(1);

        if (!isNaN(parsedVal)) {
            this.trendVal = parsedVal;
        } else {
            this.trendVal = this.identifyData.data['trend_value__valeur_tendance'];
        }

        if (parseFloat(this.identifyData.data['trend_value__valeur_tendance']) > 0) {
            this.trendPrefix = '+';
        }
    },
    methods: {
    },
    data() {
        return {
            trendVal: null,
            trendPrefix: '',
            TRANSLATIONS: {
                'en': {
                    stationId: 'AHCCD station ID',
                    trendValue: 'Trend value',
                    no_trend: 'No trend calculated',
                    elevation: 'Elevation',
                    province: 'Province/Territory',
                    measurementUnit: {
                        total_precip: 'mm',
                        temp_mean: '°C',
                        temp_max: '°C',
                        temp_min: '°C',
                        wind_speed: 'km/h',
                        pressure_station: 'kPa',
                        pressure_sea_level: 'kPa'
                    },
                    yearRange: 'Trend period',
                    noYearRange: 'No trend period',
                    timePeriod: {
                        title: 'Time period',
                        Jan: 'January',
                        Feb: 'February',
                        Mar: 'March',
                        Apr: 'April',
                        May: 'May',
                        Jun: 'June',
                        Jul: 'July',
                        Aug: 'August',
                        Sep: 'September',
                        Oct: 'October',
                        Nov: 'November',
                        Dec: 'December',
                        Win: 'Winter',
                        Spr: 'Spring',
                        Smr: 'Summer',
                        Fal: 'Autumn',
                        Ann: 'Annual'
                    },
                    learnMore: {
                        default: 'Learn more about Adjusted and Homogenized Canadian Climate Data (AHCCD) dataset.',
                        link: 'https://www.canada.ca/en/environment-climate-change/services/climate-change/canadian-centre-climate-services/display-download/technical-documentation-adjusted-climate-data.html'
                    }
                },
                'fr': {
                    stationId: 'Numéro de la station DCCAH',
                    trendValue: 'Valeur de la tendance',
                    no_trend: 'Aucune tendance calculée',
                    elevation: 'Altitude',
                    province: 'Province / Territoire',
                    measurementUnit: {
                        total_precip: 'mm',
                        temp_mean: '°C',
                        temp_max: '°C',
                        temp_min: '°C',
                        wind_speed: 'km/h',
                        pressure_station: 'kPa',
                        pressure_sea_level: 'kPa'
                    },
                    yearRange: 'Période de tendance',
                    noYearRange: 'Aucune période de tendance',
                    timePeriod: {
                        title: 'Période',
                        Jan: 'Janvier',
                        Feb: 'Février',
                        Mar: 'Mars',
                        Apr: 'Avril',
                        May: 'Mai',
                        Jun: 'Juin',
                        Jul: 'Juillet',
                        Aug: 'Août',
                        Sep: 'Septembre',
                        Oct: 'Octobre',
                        Nov: 'Novembre',
                        Dec: 'Décembre',
                        Win: 'Hiver',
                        Spr: 'Printemps',
                        Smr: 'Été',
                        Fal: 'Automne',
                        Ann: 'Annuel'
                    },
                    learnMore: {
                        default: 'En savoir plus sur l’ensemble de données climatiques canadiennes ajustées et homogénéisées (DCCAH).',
                        link: 'https://www.canada.ca/fr/environnement-changement-climatique/services/changements-climatiques/centre-canadien-services-climatiques/afficher-telecharger/documentation-technique-donnees-climatiques-ajustees.html'
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
            <dl>
                <dt>
                    <span>{{ TRANSLATIONS[lang].province }}</span>
                </dt>
                <dd>{{ identifyData.data.province__province }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].elevation }}</span>
                </dt>
                <dd>{{ identifyData.data.elevation__elevation }}</dd>

                <dt>
                    <span>{{ TRANSLATIONS[lang].stationId }}</span>
                </dt>
                <dd>{{ identifyData.data.station_id__id_station }}</dd>
            </dl>
        </div>
    `,
    methods: {
    },
    beforeMount() {
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
                    stationName: 'Station name',
                    stationId: 'AHCCD station ID',
                    coordinates: 'Coordinates',
                    elevation: 'Elevation',
                    province: 'Province/Territory'
                },

                'fr': {
                    stationName: 'Nom de la station',
                    stationId: 'Numéro de la station DCCAH',
                    coordinates: 'Coordonnées',
                    elevation: 'Altitude',
                    province: 'Province / Territoire'
                }
            },
            lang: 'en'
        }
    }
};




export default function register(rampInstance) {
    rampInstance.$element.component('ahccdStationTemplate', stationTemplate);

    rampInstance.$element.component('ahccdVariableTemplate', variableTemplate);
}