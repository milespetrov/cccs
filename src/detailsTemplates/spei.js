import { formatLatLong } from '@/globals/utils';
var variableTemplate = {
    props: ['identifyData'],
    template: `
        <div class="cdv-details">

            <h3> CLIENT CONTENT GOES HERE below is a simple example</h3>

            <h4 class="h5 mrgn-tp-sm mrgn-bttm-sm">{{ latlong[1].toFixed(6) }}, {{ latlong[0].toFixed(6) }}</h4>
            <span class="sub-title mrgn-tp-sm mrgn-bttm-md">{{ TRANSLATIONS[lang].latlong }}</span>

            <span class="divider mrgn-bttm-md"></span>

            <dl>
                <dt>
                    <span>{{ TRANSLATIONS[lang].trendValue[variable] }}</span>
                </dt>
                <dd>{{ value }}</dd>
            </dl>

            <!--a class="learnMore-link" :href='TRANSLATIONS[lang].learnMore.link' target=_blank>{{ TRANSLATIONS[lang].learnMore.default }}</a-->
        </div>
    `,
    methods: {
        async parseData() {
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
            variable: '',
            value: '',
            TRANSLATIONS: {
                'en': {
                    latlong: 'Latitude, longitude',
                    trendValue: {
                        spei: 'Standardized precipitation and evapotranspiration index',
                    }
                },

                'fr': {
                    latlong: 'Latitude, longitude',
                    trendValue: {
                        spei: 'Standardized precipitation and evapotranspiration index',
                    }
                }
            },
            lang: 'en'
        }
    }
};

export default function register(rampInstance) {
    rampInstance.$element.component('speiVariableTemplate', variableTemplate);
}