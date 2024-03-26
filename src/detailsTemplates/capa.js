var variableTemplate = {
    props: ['identifyData'],
    template:`
        <div class="cdv-details">
            <h4 class="h5 mrgn-tp-sm mrgn-bttm-sm">{{ properties.latlong.x.toFixed(6) }}, {{ properties.latlong.y.toFixed(6) }}</h4>
            <span class="sub-title mrgn-tp-sm mrgn-bttm-md">{{ TRANSLATIONS[lang].latlong }}</span>
            <span class="divider mrgn-bttm-md"></span>
            <dl>
                <dt>
                    <span>{{ TRANSLATIONS[lang].value }}</span>
                </dt>
                <dd>{{ properties.value_0 }}</dd>
            </dl>
            <dl>
                <dt>
                    <span>{{ TRANSLATIONS[lang].value2 }}</span>
                </dt>
                <dd>{{ properties.value_1 }}</dd>
            </dl>
        </div>
    `,
    methods: {
    },
    async beforeMount(){
        this.lang = document.documentElement.lang;

        var resultData = this.identifyData.data.split('Feature 0:')[1].split('\n');

        for (var i = 1; i < resultData.length; i++) {
            var splitResult = resultData[i]
                .trim()
                .split(' = ')
                .map(function(val) {
                    return val.replace(/'/g, '');
                });
            this.properties[splitResult[0]] = splitResult[1];
        }

        this.properties.value_0 = parseFloat(this.properties.value_0).toFixed(1);

        // reproject from 3978 to 4326
        var point = new RAMP.geo.geom.Point(3978, [parseFloat(this.properties.x), parseFloat(this.properties.y)]);
        await RAMP.geo.proj.projectGeometry(4326, point).then((data) => {
            this.latlong = data;
        });
    },
    data() {
        return {
            properties: {},
            TRANSLATIONS: {
                'en': {
                    latlong: 'Latitude, longitude',
                    value: 'Total precipitation amount analysis (mm)',
                    value2: 'Confidence index'
                },
                'fr': {
                    latlong: 'Latitude, longitude',
                    value: 'Analyse de la quantité totale de précipitations (mm)',
                    value2: 'Indice de confiance'
                }
            },
            lang: 'en'
        }
    }
};

export default function register(rampInstance) {
    rampInstance.$element.component('capaVariableTemplate', variableTemplate);
}