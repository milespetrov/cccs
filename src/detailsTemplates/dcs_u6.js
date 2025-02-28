import { formatLatLong } from '@/globals/utils';
var variableTemplate = {
    props: ['identifyData'],
    template: `
        <div class="dcs-details">
            <div class="short-form" :class="variable + '-icon'">
                <p><span>{{TRANSLATIONS[lang].details[0]}}</span></p>
                <p class="data-value">{{ value }}{{TRANSLATIONS[lang].measurementUnit[variable]}}</p>
                <p class="supporting-value">{{TRANSLATIONS[lang].range}} {{ minRangeValue }}{{TRANSLATIONS[lang].measurementUnit[variable]}} {{TRANSLATIONS[lang].to}} {{ maxRangeValue }}{{TRANSLATIONS[lang].measurementUnit[variable]}}</p>
                <p><span>{{TRANSLATIONS[lang].details[1]}}</span></p>
                <p class="supporting-value">{{TRANSLATIONS[lang].timeSlider[timeSlice]}}</p>
                <p><span>{{TRANSLATIONS[lang].details[2]}}</span></p>
                <p class="supporting-value">{{ latlong[1]?.toFixed(6) }}, {{ latlong[0]?.toFixed(6) }}</p>
            </div>
            <span class="divider mrgn-bttm-md"></span>
            <div class="long-form">
                <p class="details-row"><span class="details-label">{{TRANSLATIONS[lang].timePeriod.label}}:</span><span class="details-value">{{TRANSLATIONS[lang].timePeriod[timePeriod]}}</span></p>
                <p class="details-row"><span class="details-label">{{TRANSLATIONS[lang].variable.label}}:</span><span class="details-value">{{TRANSLATIONS[lang].variable[variable]}}</span></p>
                <p class="details-row"><span class="details-label">{{TRANSLATIONS[lang].ssp.label}}:</span><span class="details-value">{{TRANSLATIONS[lang].ssp[ssp]}}</span></p>
            </div>
            <span class="divider mrgn-bttm-md mrgn-tp-md"></span>
            <div class="long-form">
                <p>{{TRANSLATIONS[lang].baseline}}</p>
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
            this.ssp = new RegExp('[?&]s=(ssp[^&]*)').exec(window.location.href)[1];

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
    mounted() {
        var params = new URLSearchParams(this.identifyData.data.requestOptions.query);

        var origLayer = params.get('LAYERS');

        params.set('LAYERS', origLayer.replace('Pct50', 'Pct10'));
        params.set('QUERY_LAYERS', origLayer.replace('Pct50', 'Pct10'));

        try {
            fetch(this.identifyData.data.url + '?' + params.toString()).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        var parsedVal = parseFloat(data.features[0].properties.value).toFixed(1);
                        this.minRangeValue = ((parsedVal >= 0) ? '+' : '') + parsedVal;
                    });
                }
            });
        } catch (error) {

        }

        params.set('LAYERS', origLayer.replace('Pct50', 'Pct90'));
        params.set('QUERY_LAYERS', origLayer.replace('Pct50', 'Pct90'));

        try {
            fetch(this.identifyData.data.url + '?' + params.toString()).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        var parsedVal = parseFloat(data.features[0].properties.value).toFixed(1);
                        this.maxRangeValue = ((parsedVal >= 0) ? '+' : '') + parsedVal;
                    });
                }
            });
        } catch (error) {

        }
    },
    data() {
        return {
            latlong: {},
            value: '',
            minRangeValue: '',
            maxRangeValue: '',
            variable: '',
            timeSlice: '',
            timePeriod: '',
            ssp: '',
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
                        precip: 'Total precipitation'
                    },
                    measurementUnit: {
                        precip: '%',
                        tmean: '°C',
                        tmin: '°C',
                        tmax: '°C'
                    },
                    timeSlider: [
                        '2021-2050',
                        '2041-2070',
                        '2071-2100'
                    ],
                    ssp: {
                        label: 'Emissions scenario',
                        ssp585: 'SSP5-8.5',
                        ssp245: 'SSP2-4.5',
                        ssp126: 'SSP1-2.6'
                    },
                    details: [
                        'Projected change of',
                        'by',
                        'at'
                    ],
                    range: 'Range',
                    baseline: 'Projected changes are with respect to the reference period of 1971-2000.',
                    to: 'to'
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
                        tmax: '°C'
                    },
                    timeSlider: [
                        '2021-2050',
                        '2041-2070',
                        '2071-2100'
                    ],
                    ssp: {
                        label: "Scénarios d'émissions",
                        ssp585: 'SSP5-8.5',
                        ssp245: 'SSP2-4.5',
                        ssp126: 'SSP1-2.6'
                    },
                    details: [
                        'Changement projeté de',
                        'par',
                        'à'
                    ],
                    range: 'Portée',
                    baseline: 'Les changements projetés sont relatives à la moyenne de 1971-2000.',
                    to: 'à'
                }
            },
            lang: 'en'
        }
    }
};

export default function register(rampInstance) {
    rampInstance.$element.component('dcsu6VariableTemplate', variableTemplate);
}