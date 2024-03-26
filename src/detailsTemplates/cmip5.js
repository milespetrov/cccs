var variableTemplate = {
    props: ['identifyData'],
    template:`
        <div class="cmip5-details">
            <div class="short-form" :class="variable + '-icon'">
                <p><span>{{TRANSLATIONS[lang].details[0]}}</span></p>
                <p class="data-value">{{ value }}{{TRANSLATIONS[lang].measurementUnit[variable]}}</p>
                <p><span>{{TRANSLATIONS[lang].details[1]}}</span></p>
                <p class="supporting-value">{{TRANSLATIONS[lang].timeSlider[timeSlice]}}</p>
                <p><span>{{TRANSLATIONS[lang].details[2]}}</span></p>
                <p class="supporting-value">{{ latlong.y.toFixed(6) }}, {{ latlong.x.toFixed(6) }}</p>
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
                <a :href='TRANSLATIONS[lang].learnMore.link' target=_blank>{{ TRANSLATIONS[lang].learnMore.default }}</a>
            </div>
        </div>
    `,
    methods: {
    },
    async beforeMount(){
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
        if (!isNaN(parsedVal)){
            this.value = ((parsedVal >= 0) ? '+' : '') + parsedVal;
        } else {
            this.value = tempVal;
        }

        // reproject from 3978 to 4326
        var point = new RAMP.geo.geom.Point(3978, this.identifyData.data.data.features[0].geometry.coordinates);
        await RAMP.geo.proj.projectGeometry(4326, point).then((data) => {
            this.latlong = data;
        });
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
                        sic: 'Sea ice concentration',
                        sit: 'Sea ice thickness',
                        precip: 'Total precipitation',
                        sfcwind: 'Surface wind speed',
                        snd: 'Snow depth'
                    },
                    measurementUnit: {
                        precip: '%',
                        tmean: '°C',
                        sfcwind: '%',
                        sic: '%',
                        sit: '%',
                        snd: '%'
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
                        default: 'Learn more about the Global climate model scenarios dataset.',
                        link: 'https://www.canada.ca/en/environment-climate-change/services/climate-change/canadian-centre-climate-services/display-download/technical-documentation-coupled-model-intercomparison-phase5.html'
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
                        sic: 'Concentration de la glace de mer',
                        sit: 'Épaisseur de la glace de mer',
                        precip: 'Précipitations totales',
                        sfcwind: 'Vitesse du vent',
                        snd: 'Épaisseur de la neige'
                    },
                    measurementUnit: {
                        precip: '%',
                        tmean: '°C',
                        sfcwind: '%',
                        sic: '%',
                        sit: '%',
                        snd: '%'
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
                        default: 'En savoir plus sur l’ensemble de données Scénarios basés sur des modèles climatiques globaux.',
                        link: 'https://www.canada.ca/fr/environnement-changement-climatique/services/changements-climatiques/centre-canadien-services-climatiques/afficher-telecharger/documentation-technique-phase5-intercomparaison-modeles-couples.html'
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
    rampInstance.$element.component('cmip5VariableTemplate', variableTemplate);
}