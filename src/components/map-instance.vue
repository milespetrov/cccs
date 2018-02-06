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
    'en-CA': {
        [key: string]: {
            [key: string]: {
                [key: string]: string;
            };
        };
    };
    'fr-CA': { [key: string]: { [key: string]: { [key: string]: string } } };
    [key: string]: {
        [key: string]: { [key: string]: { [key: string]: string } };
    };
}

@Component
export default class MapInstance extends Vue {
    tooltipTemplates: tooltips = {
        'en-CA': {
            ahccd: {
                tmean: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                    value_key: 'Annual_Mean'
                },
                tmin: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                    value_key: 'Annual_Min'
                },
                tmax: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                    value_key: 'Annual_Max'
                },
                precip: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                    value_key: 'Annual_Annuel'
                }
            }
        },
        'fr-CA': {
            ahccd: {
                tmean: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                    value_key: 'Annual_Mean'
                },
                tmin: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                    value_key: 'Annual_Mean'
                },
                tmax: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                    value_key: 'Annual_Mean'
                },
                precip: {
                    template:
                        "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                    value_key: 'Annual_Mean'
                }
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
                    const currentTemplate = this.tooltipTemplates[lang][
                        dataSet
                    ][this.currentVariable!];
                    const name = a.station_name_nom;
                    const value = Intl.NumberFormat(lang).format(
                        a[currentTemplate.value_key]
                    );
                    tooltip = z.add(
                        sprintf.sprintf(currentTemplate.template, <any>{
                            name,
                            value
                        })
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

    private miniChartSectionId: string = 'cip-mini-chart-section';
    private miniChartChartId: string = 'cip-mini-chart-chart';

    beforeDestroy(): void {
        // destroy the mini-chart DV section when the map component is reloaded
        const miniChartSection = api.DQV.sections[this.miniChartSectionId];
        if (miniChartSection) {
            miniChartSection.destroy();
        }
    }

    async displayMiniChart(features: any): Promise<void> {
        console.log('display mini chart');
        let station_id: string = '';

        features.data.forEach((attrib: any) => {
            if (attrib.key == 'stnid' || attrib.key == 'Station ID') {
                station_id = attrib.value;
                return;
            }
        });
        this.setStationId(station_id);

        // TODO: abstract data retrieval to a single place
        const data = await api.getData(
            this.currentTimePeriod,
            this.currentVariable,
            this.currentDataset,
            station_id
        );

        const config = ahccdTemp(
            data,
            this.currentTimePeriod,
            this.currentVariable,
            <any>station_id,
            true
        );

        console.log(config);

        // if the mini-chart is already loaded, update its config
        const miniChartChart = api.DQV.charts[this.miniChartChartId];
        if (miniChartChart) {
            miniChartChart.config = config;
            return;
        }

        // create the mini-chart
        new api.DQV.Chart({ id: 'cip-mini-chart-chart', config });
        const dvsection = new api.DQV.Section({
            id: 'cip-mini-chart-section',
            template: `<dv-section><dv-chart id="cip-mini-chart-chart"></dv-chart></dv-section>`
        });

        this.mapInstance.ui.anchors.CONTEXT_MAP.html(`
            <div class="mApiOverViewMap">
                <div id="cip-mini-chart-mount"></div>
            </div>
        `);

        // seems that you need to subscribe every time after setting the gust of the context map node
        this.mapInstance.ui.anchors.CONTEXT_MAP.on(
            'click',
            this.changeViewToChart
        );

        dvsection.mount(document.getElementById('cip-mini-chart-mount'));

        // console.log(features);
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
