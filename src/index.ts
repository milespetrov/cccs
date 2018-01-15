import $ from 'jquery';

import Vue from 'vue';
import app from './app.vue';

Vue.config.ignoredElements = ['dv-section', 'dv-chart', 'dv-chart-table'];

new Vue({
    el: '#app',
    template: '<app/>',
    components: { app }
});

//

//window.addEventListener('load', boot);

/* function boot(): void {
    const DQV: any = (<EnhancedWindow>window).DQV;
    const $: any = (<EnhancedWindow>window).$;

    let stnid = 1171393;
    let period = 'Annual_Annuel'; // Annual_Annuel, Mar_March

    const data = {
        name: 'foobar'
    };

    const template = `
        <dv-section>
            <dv-chart id="dvChart1"></dv-chart>
        </dv-section>
    `;

    const JSONGroupBy = (<any>window).JSONGroupBy;

    const configPromise = new Promise(resolve =>
        $.getJSON(
            'https://ramp-pcar.github.io/dqvue/samples/AHCCD_Mean_Temp.json',
            (data: any) => {
                const stationData = JSONGroupBy(
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
                        text: `Mean Temperature at ${
                            stationData.station_name_nom[0]
                        }, ${stationData.Year_Annee[0]} - ${
                            stationData.Year_Annee[
                                stationData.Year_Annee.length - 1
                            ]
                        }`
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

                resolve(config);
            }
        )
    );

    const dvchart1 = new DQV.Chart({ id: 'dvChart1', config: configPromise });
    const dvsection1 = new DQV.Section({ id: 'dvSection1', template, data });
    dvsection1.mount(document.getElementById('mount-point'));
} */
