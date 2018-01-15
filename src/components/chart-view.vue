<template>
    <div>
        <div id="mount-point"></div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import api from './../api/main';

@Component
export default class ChartView extends Vue {
    @Watch('selectedTimePeriod')
    onSelectedTimePeriodChanged(): void {
        this.updateDQV();
    }

    @Prop() selectedTimePeriod: string;

    private data: any[];

    async mounted(): Promise<void> {
        console.log('aaa---');
        if (!this.data) {
            this.data = await api.getData();

            const config = this.makeConfig(this.data, this.selectedTimePeriod);
            this.initDQV(config);
            return;
        }
    }

    initDQV(config: object): void {
        const data = {
            name: 'foobar'
        };

        const template = `
            <dv-section>
                <dv-chart id="dvChart1"></dv-chart>
            </dv-section>
        `;

        const dvchart1 = new api.DQV.Chart({
            id: 'dvChart1',
            config
        });
        const dvsection1 = new api.DQV.Section({
            id: 'dvSection1',
            template,
            data
        });
        dvsection1.mount(document.getElementById('mount-point'));
    }

    updateDQV(): void {
        const config = this.makeConfig(this.data, this.selectedTimePeriod);

        const dvChart = api.DQV.charts['dvChart1'];
        dvChart.config = config;
    }

    makeConfig(
        data: string[],
        period: string,
        stnid: number = 1171393
    ): object {
        const stationData = api.JSONGroupBy(
            data,
            ['stnid'],
            [period, 'Year_Annee', 'station_name_nom']
        )[stnid];
        const stationTrendValue = 2.35;

        const seriesData = stationData[period].map(
            (value: number) => (value > -9999 ? value : null)
        );

        const config = {
            chart: {
                zoomType: 'x',
                zoomSlider: {
                    step: 1
                },
                events: {
                    load: function() {
                        const ren = (<any>this).renderer;

                        // const point = chart.series[0].points[0];
                        ren
                            .label(
                                `Trend value: <b>${stationTrendValue}</b>`,
                                80,
                                50
                            )
                            .css({
                                color: '#ecf0f1'
                            })
                            .attr({
                                fill: '#2c3e50',
                                padding: 8,
                                zIndex: 6
                            })
                            .add();
                        ren
                            .label(
                                `Trend value: <b>${stationTrendValue}</b>`,
                                80,
                                90
                            )
                            .css({
                                color: '#ecf0f1'
                            })
                            .attr({
                                fill: '#2c3e50',
                                padding: 8,
                                zIndex: 6
                            })
                            .add();
                    }
                }
            },
            credits: {
                enabled: false
            },

            title: {
                text: `Mean Temperature at ${stationData
                    .station_name_nom[0]}, ${stationData
                    .Year_Annee[0]} - ${stationData.Year_Annee[
                    stationData.Year_Annee.length - 1
                ]}`
            },
            subtitle: {
                text: 'ccpid.ca'
            },
            xAxis: {
                // categories: stationData.Year_Annee,
                title: {
                    text: 'Year'
                },
                minRange: 20,
                crosshair: true
            },
            yAxis: {
                title: {
                    text: 'Mean Temperature, °C'
                },
                min: Math.min(0, ...seriesData),
                max: Math.max(...seriesData)
            },
            tooltip: {
                shared: true,
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: stationData.Year_Annee[0]
                }
            },

            series: [
                {
                    name: period,
                    data: seriesData,
                    type: 'column',
                    pointPadding: 0.1,
                    groupPadding: 0.1
                }
            ]
        };

        return config;
    }
}
</script>

<style lang="scss" scoped>

</style>


