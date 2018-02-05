<template>
    <div id="map-anchor">

        <span></span>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import sprintf from 'sprintf-js';

import api from './../api/main';
import ahccdTemp from '../configs/chart/ahccd-temp';
import { Dictionary } from 'vue-router/types/router';

interface tooltips {
    'en-CA': { [key: string]: { [key: string]: string } };
    'fr-CA': { [key: string]: { [key: string]: string } };
    [key: string]: { [key: string]: { [key: string]: string } };
}

@Component
export default class MapInstance extends Vue {
    tooltipTemplates: tooltips = {
        'en-CA': {
            ahccd: {
                tmean:
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                tmin:
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                tmax:
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                precip:
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>"
            }
        },
        'fr-CA': {
            ahccd: {
                tmean:
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                tmin:
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                tmax:
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                precip:
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>"
            }
        }
    };

    get anchor(): HTMLElement {
        return document.getElementById('map-anchor')!;
    }

    @State('variableId') currentVariable: string;
    @State('datasetId') currentDataset: string;
    @State('timePeriodId') currentTimePeriod: string;

    @Getter getQuery: Dictionary<string>;

    @Action setStationId: (value: string) => void;

    mapInstance: any = null;

    mounted(): void {
        if (api.DQV.sections['dv5']) {
            api.DQV.sections['dv5'].destroy();
        }

        let RZ = (<any>window).RZ;
        // TODO: link to a language choice; property, or stored value, or button
        let lang = 'en-CA';
        // TODO: link once dataSet selector is finalized
        let dataSet = 'ahccd';

        if (!RZ) {
            console.log('nope');

            window.setTimeout(() => this.mounted(), 2000);

            return;
        }

        if (this.currentVariable === null || this.currentDataset === null) {
            console.log('nope2');
            return;
        }

        new RZ.Map(
            this.anchor,
            `./assets/configs/config-${
                this.currentDataset
            }-${this.currentVariable.replace(/_/g, '-')}.en-CA.json`
        );

        let tooltip;
        RZ.mapAdded.subscribe(() => {
            this.mapInstance = RZ.mapInstances[RZ.mapInstances.length - 1];

            this.mapInstance.identify = false;

            this.mapInstance.ui.tooltip.mouseOver.subscribe((z: any) => {
                z.event.preventDefault();
                z.attribs.then((a: any) => {
                    const name = a.station_name_nom;
                    const value = Intl.NumberFormat(lang).format(
                        a.Annual_Annuel
                    );
                    const currentTemplate = this.tooltipTemplates[lang][
                        dataSet
                    ][this.currentVariable!];
                    tooltip = z.add(
                        sprintf.sprintf(currentTemplate, <any>{ name, value })
                    );
                });
            });
            console.log('map instance added');

            this.mapInstance.ui.anchors.CONTEXT_MAP.html(`
                <div class="mApiOverViewMap">
                    <div id="dvMountPoint1"></div>
                </div>
            `);

            this.mapInstance.click.subscribe((event: any) => {
                event.features.subscribe(this.displayMiniChart);
            });
        });
    }

    async displayMiniChart(features: any): Promise<void> {
        console.log('display mini chart');

        this.setStationId(features.data[2].value);

        // TODO: abstrack data retrieval to a single place
        const data = await api.getData(
            this.currentTimePeriod,
            this.currentVariable,
            this.currentDataset,
            features.data[2].value
        );

        const config = ahccdTemp(
            data,
            this.currentTimePeriod,
            this.currentVariable,
            features.data[2].value,
            true
        );

        console.log(config);

        if (api.DQV.charts['dvChart5_1']) {
            api.DQV.charts['dvChart5_1'].config = config;
            return;
        }

        const template = `
            <dv-section id="dv5">
            <dv-chart id="dvChart5_1"></dv-chart>
            </dv-section>
        `;

        const dvchart1 = new api.DQV.Chart({
            id: 'dvChart5_1',
            config
        });
        const dvsection = new api.DQV.Section({ id: 'dv5', template });

        this.mapInstance.ui.anchors.CONTEXT_MAP.html(`
            <div class="mApiOverViewMap">
                <div id="dvMountPoint1"></div>
            </div>
        `);

        // seems that you need to subscribe every time after setting the gust of the context map node
        this.mapInstance.ui.anchors.CONTEXT_MAP.on(
            'click',
            this.changeViewToChart
        );

        dvsection.mount(document.getElementById('dvMountPoint1'));

        console.log(features);
    }

    changeViewToChart(): void {
        this.$router.push({
            name: 'chart-view',
            query: this.getQuery
        });
    }
}
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';

#map-anchor {
    /* right: 0;
    left: 0;
    width: 100%; */
    height: $backdrop-map-height;
    // position: absolute;
}
</style>
