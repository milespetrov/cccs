function makeConfig(stationData: any, period: string, stnid: number = 1171393) {
    const stationTrendValue = 2.35;

    const seriesData = stationData.absolute_values.map(
        (value: number) => (value > -9999 ? value : null)
    );

    let secondTrendValueLabel: HTMLElement;

    const config = {
        chart: {
            zoomType: 'x',
            zoomSlider: {
                step: 1
            },
            events: {
                load: (event: any) => {
                    const ren = event.target.renderer;

                    // draw the first trend value
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

                    // draw the second trend value
                    secondTrendValueLabel = ren
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

                    (<any>secondTrendValueLabel).textSetter(
                        `Trend value: <b>${(Math.random() * 5).toFixed(2)}</b>`
                    );
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

export default makeConfig;
