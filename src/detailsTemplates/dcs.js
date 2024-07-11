import { formatLatLong } from '@/globals/utils';
var variableTemplate = {
    props: ['identifyData'],
    template: `
        <div class="dcs-details">
            <div class="short-form" :class="variable + '-icon'">
                <p><span>{{TRANSLATIONS[lang].details[0]}}</span></p>
                <p class="data-value">{{ value }}{{TRANSLATIONS[lang].measurementUnit[variable]}}</p>
                <p><span>{{TRANSLATIONS[lang].details[1]}}</span></p>
                <p class="supporting-value">{{TRANSLATIONS[lang].timeSlider[timeSlice]}}</p>
                <p><span>{{TRANSLATIONS[lang].details[2]}}</span></p>
                <p class="supporting-value">{{ latlong[1].toFixed(6) }}, {{ latlong[0].toFixed(6) }}</p>
            </div>
            <span class="divider mrgn-bttm-md"></span>
            <div class="long-form">
                <p class="details-row"><span class="details-label">{{TRANSLATIONS[lang].timePeriod.label}}:</span><span class="details-value">{{TRANSLATIONS[lang].timePeriod[timePeriod]}}</span></p>
                <p class="details-row"><span class="details-label">{{TRANSLATIONS[lang].variable.label}}:</span><span class="details-value">{{TRANSLATIONS[lang].variable[variable]}}</span></p>
                <p class="details-row"><span class="details-label">{{TRANSLATIONS[lang].rcp.label}}:</span><span class="details-value">{{TRANSLATIONS[lang].rcp[rcp]}}</span></p>
            </div>
            <span class="divider mrgn-bttm-md mrgn-tp-md"></span>
            <div class="long-form">
                <p>{{TRANSLATIONS[lang].baseline}}</p>
                <a class="learnMore-link" :href='TRANSLATIONS[lang].learnMore.link' target=_blank>{{ TRANSLATIONS[lang].learnMore.default }}</a>
            </div>
        </div>
    `,
    methods: {
        async parseData() {
            this.lang = document.documentElement.lang;

            if (typeof this.identifyData.data === 'undefined') {
                return null;
            }

            this.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];
            this.timeSlice = new RegExp('[?&]ts=([0-9])').exec(window.location.href)[1];
            this.timePeriod = new RegExp('[?&]t=([^&]*)').exec(window.location.href)[1];
            this.rcp = new RegExp('[?&]r=(rcp[^&]*)').exec(window.location.href)[1];

            var tempVal = this.identifyData.data.data.features[0].properties.value;
            var parsedVal = parseFloat(tempVal).toFixed(1); // seems to not error if gargabe is passed in
            if (!isNaN(parsedVal)) {
                this.value = ((parsedVal >= 0) ? '+' : '') + parsedVal;
            } else {
                this.value = tempVal;
            }

            // reproject from 3978 to 4326
            this.latlong = await this.$iApi.geo.proj.projectGeoJson(
                JSON.parse(
                    JSON.stringify(
                        this.identifyData.data.data.features[0].geometry
                    )
                ),
                3978,
                4326
            );
            this.latlong = this.latlong.coordinates;
        }
    },
    async beforeMount() {
        await this.parseData();
    },
    async beforeUpdate() {
        await this.parseData();
    },
    data() {
        return {
            latlong: {},
            value: '',
            variable: '',
            timeSlice: '',
            timePeriod: '',
            rcp: '',
            TRANSLATIONS: {
                'en': {
                    latlong: 'Latitude, longitude',
                    timePeriod: {
                        label: 'Time of year',
                        annual: 'Annual',
                        spring: 'Spring',
                        summer: 'Summer',
                        fall: 'Autumn',
                        winter: 'Winter'
                    },
                    variable: {
                        label: 'Variable',
                        tmean: 'Mean temperature',
                        tmin: 'Daily minimum temperature',
                        tmax: 'Daily maximum temperature',
                        precip: 'Total precipitation',
                        gso: 'Growing season overwinter (CLIENT CONTENT)',
                        gsc: 'Growing season cool (CLIENT CONTENT)',
                        gsw: 'Growing season warm (CLIENT CONTENT)'
                    },
                    measurementUnit: {
                        precip: '%',
                        tmean: '°C',
                        tmin: '°C',
                        tmax: '°C',
                        gso: 'days (CLIENT CONTENT)',
                        gsc: 'days (CLIENT CONTENT)',
                        gsw: 'days (CLIENT CONTENT)'
                    },
                    timeSlider: [
                        '2021-2040',
                        '2041-2060',
                        '2061-2080',
                        '2081-2100'
                    ],
                    rcp: {
                        label: 'Emission scenario',
                        rcp85: 'High',
                        rcp45: 'Moderate',
                        rcp26: 'Low'
                    },
                    learnMore: {
                        default: 'Learn more about the Statistically downscaled climate data dataset.',
                        link: 'https://www.canada.ca/en/environment-climate-change/services/climate-change/canadian-centre-climate-services/display-download/technical-documentation-downscaled-climate-scenarios.html'
                    },
                    details: [
                        'Projected change of',
                        'by',
                        'at'
                    ],
                    baseline: 'The projected change is relative to the 1986-2005 average.'
                },
                'fr': {
                    latlong: 'Latitude, longitude',
                    timePeriod: {
                        label: "Temps de l'année",
                        annual: 'Annuel',
                        spring: 'Printemps',
                        summer: 'Été',
                        fall: 'Automne',
                        winter: 'Hiver'
                    },
                    variable: {
                        label: 'Variable',
                        tmean: 'Température moyenne',
                        tmin: 'Température minimale quotidienne',
                        tmax: 'Température maximale quotidienne',
                        precip: 'Précipitations totales',
                        gso: 'Growing season overwinter (CLIENT CONTENT)',
                        gsc: 'Growing season cool (CLIENT CONTENT)',
                        gsw: 'Growing season warm (CLIENT CONTENT)'
                    },
                    measurementUnit: {
                        precip: '%',
                        tmean: '°C',
                        tmin: '°C',
                        tmax: '°C',
                        gso: 'jours (CLIENT CONTENT)',
                        gsc: 'jours (CLIENT CONTENT)',
                        gsw: 'jours (CLIENT CONTENT)'
                    },
                    timeSlider: [
                        '2021-2040',
                        '2041-2060',
                        '2061-2080',
                        '2081-2100'
                    ],
                    rcp: {
                        label: "Scénarios d'émissions",
                        rcp85: 'Élevées',
                        rcp45: 'Modérées',
                        rcp26: 'Faibles'
                    },
                    learnMore: {
                        default:
                            "En savoir plus sur l’ensemble de données Scénarios climatiques mis à l’échelle de manière statistique.",
                        link: 'https://www.canada.ca/fr/environnement-changement-climatique/services/changements-climatiques/centre-canadien-services-climatiques/afficher-telecharger/documentation-technique-scenarios-climatiques-echelle-reduite.html'
                    },
                    details: [
                        'Changement projeté de',
                        'par',
                        'à'
                    ],
                    baseline: 'Les changements projetés sont relatives à la moyenne de 1986-2005.'
                }
            },
            lang: 'en'
        }
    }
};

export default function register(rampInstance) {
    rampInstance.$element.component('dcsVariableTemplate', variableTemplate);
}