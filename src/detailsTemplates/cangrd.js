var variableTemplate = {
    props: ['identifyData'],
    template:`
        <div class="cdv-details">

            <h4 class="h5 mrgn-tp-sm mrgn-bttm-sm">{{ latlong[1].toFixed(6) }}, {{ latlong[0].toFixed(6) }}</h4>
            <span class="sub-title mrgn-tp-sm mrgn-bttm-md">{{ TRANSLATIONS[lang].latlong }}</span>

            <span class="divider mrgn-bttm-md"></span>

            <dl>
                <dt>
                    <span>{{ TRANSLATIONS[lang].trendValue[variable] }}</span>
                </dt>
                <dd>{{ value }}</dd>
            </dl>

            <a class="learnMore-link" :href='TRANSLATIONS[lang].learnMore.link' target=_blank>{{ TRANSLATIONS[lang].learnMore.default }}</a>
        </div>
    `,
    methods: {
    },
    async beforeMount(){
        this.lang = document.documentElement.lang;

        this.variable = new RegExp('[?&]v=([^&]*)').exec(window.location.href)[1];

        this.value = parseFloat(this.identifyData.data.data.features[0].properties.value).toFixed(1);

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
    },
    data() {
        return {
            latlong: {},
            variable: '',
            value: '',
            TRANSLATIONS: {
                'en': {
                    latlong: 'Latitude, longitude',
                    trendValue: {
                        precip: 'Trend of relative total precipitation change (%) over 1948-2012',
                        tmean: 'Trend of temperature change (°C) over 1948-2018'
                    },
                    learnMore: {
                        default: 'Learn more about Canadian Gridded Temperature and Precipitation Anomalies (CANGRD) dataset.',
                        link: 'https://www.canada.ca/en/environment-climate-change/services/climate-change/canadian-centre-climate-services/display-download/technical-documentation-historical-climate-data.html'
                    }
                },
                'fr': {
                    latlong: 'Latitude, longitude',
                    trendValue: {
                        precip: 'Tendance de la variation relative des précipitations totales (%) de 1948 à 2012',
                        tmean: 'Tendance de la variation de température (°C) de 1948 à 2018'
                    },
                    learnMore: {
                        default: 'En savoir plus sur l’ensemble de données Anomalies de température et précipitation interpolées pour le Canada (CANGRD).',
                        link: 'https://www.canada.ca/fr/environnement-changement-climatique/services/changements-climatiques/centre-canadien-services-climatiques/afficher-telecharger/documentation-technique-donnees-climatiques-historiques.html'
                    }
                }
            },
            lang: 'en'
        }
    }
};

export default function register(rampInstance) {
    rampInstance.$element.component('cangrdVariableTemplate', variableTemplate);
}