<template>
    <div>
        <div>
            <b-dropdown id="ddown1" text="Dropdown Button" class="m-md-2" right>
                <b-dropdown-item>First Action</b-dropdown-item>
                <b-dropdown-item>Second Action</b-dropdown-item>
                <b-dropdown-item>Third Action</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item>Something else here...</b-dropdown-item>
                <b-dropdown-item disabled>Disabled action</b-dropdown-item>
            </b-dropdown>
        </div>
        
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

    private userTrendValue: SVGElement;

    async mounted(): Promise<void> {
        console.log('aaa---');
        if (!this.data) {
            this.data = await api.getData(this.selectedTimePeriod);

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
                <dv-chart id="dvChart1" dv-auto-generate-table>
                    <details>
                        <summary>View data for this chart</summary>
                        <div class="summary">
                            <dv-chart-table dv-auto-render dv-table-class="wb-tables table table-striped"></dv-chart-table>
                        </div>
                    </details>
                </dv-chart>
                
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

        (<any>window).wb.add('summary');
        (<any>window).wb.add('table');
    }

    updateDQV(): void {
        api.getData(this.selectedTimePeriod).then((data: object) => {
            const config = this.makeConfig(data, this.selectedTimePeriod);
            
            const dvChart = api.DQV.charts['dvChart1'];
            dvChart.config = config;

            (<any>window).wb.add('summary');
            (<any>window).wb.add('table');
        });
    }

    makeConfig(
        data: any,
        period: string,
        stnid: number = 1171393
    ): object {
        const stationData = data; /**api.JSONGroupBy(
            data,
            ['stnid'],
            [period, 'Year_Annee', 'station_name_nom']
        )[stnid];*/
        const stationTrendValue = 2.35;

        const seriesData = stationData.absolute_values.map(
            (value: number) => (value > -9999 ? value : null)
        );

        const config = {
            chart: {
                zoomType: 'x',
                zoomSlider: {
                    step: 1
                },
                events: {
                    load: (event: any) => {
                        const ren = event.target.renderer; //(<any>this).renderer;

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
                        this.userTrendValue = ren
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
            exporting: {
                enabled: false
            },
            title: {
                text: `Mean Temperature at ${stationData.station_name},
                 ${stationData.start_year} - ${stationData.end_year}`
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
                crosshair: true,
                events: {
                    setExtremes: (event: any) => {
                        console.log(event, event.target);

                        (<any>this.userTrendValue).textSetter(
                            `Trend value: <b>${(Math.random() * 5).toFixed(
                                2
                            )}</b>`
                        );
                        api.DQV.charts['dvChart1'];
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Mean Temperature, °C'
                },
                min: Math.min(0, ...seriesData),
                max: Math.max(0, ...seriesData)
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
                    pointStart: stationData.start_year
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
