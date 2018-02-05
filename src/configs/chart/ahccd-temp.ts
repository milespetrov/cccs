interface period_mappings {
    [key: string]: number;
}

function makeConfig(
    stationData: any,
    period: string,
    variable: string,
    stnid: number = 1021830,
    mini: boolean = false
) {
    const stationTrendValue = 2.35;

    const seriesData = stationData.absolute_values.map(
        (value: number) => (value > -9999 ? value : null)
    );

    let secondTrendValueLabel: HTMLElement;

    // HACK: get a proper variable name
    // should be retrieved from the store
    const variables: object[] = [
        {
            name: 'Mean Temperature',
            id: 'tmean'
        },
        {
            name: 'Minimum Temperature',
            id: 'tmin'
        },
        {
            name: 'Maximum Temperature',
            id: 'tmax'
        },
        {
            name: 'Precipitation',
            id: 'precip'
        }
    ];

    const item = variables.find((v: { id: string }) => v.id === variable);
    variable = item ? (<any>item).name : variable;

    const period_mappings: period_mappings = {
        Jan_Janv: 1,
        Feb_Fev: 2,
        Mar_March: 3,
        Apr_Avr: 4,
        May_Mai: 5,
        June_Juin: 6,
        July_Juil: 7,
        Aug_Aout: 8,
        Sept_Sept: 9,
        Oct_Oct: 10,
        Nov_Nov: 11,
        Dec_Dec: 12,
        Winter_Hiver: 13,
        Spring_Printemp: 14,
        Summer_Ete: 15,
        Autumn_Autome: 16,
        Annual_Annuel: 17
    };

    const config = {
        chart: {
            backgroundColor: '#f9f9f9',
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
                            650,
                            50
                        )
                        .css({
                            color: 'black' //'#ecf0f1'
                        })
                        .attr({
                            //fill: '#222222',
                            padding: 7,
                            zIndex: 6
                        })
                        .add();

                    // draw the second trend value
                    secondTrendValueLabel = ren
                        .label(``, 650, 85)
                        .css({
                            color: 'black' //'#ecf0f1'
                        })
                        .attr({
                            //fill: '#222222',
                            padding: 7,
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
            text: `${variable} at ${stationData.station_name},
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
            labels: { style: { color: 'black' } },
            minRange: 20,
            crosshair: true,
            gridLineWidth: 1,
            events: {
                setExtremes: (event: any) => {
                    console.log(event, event.target);

                    $.getJSON(
                        `http://ahccd-dev.azurewebsites.net/${stnid}/${
                            (<any>item!).id
                        }/${period_mappings[period]}/trend/${event.min}/${
                            event.max
                        }`,
                        data => {
                            console.log(data);
                            (<any>secondTrendValueLabel).textSetter(
                                `User range (${event.min}-${event.max}): <b>${
                                    (<any>data).value
                                }</b>`
                            );
                        }
                    );
                }
            }
        },
        yAxis: {
            title: {
                text: `${variable}, °C`
            },
            labels: { style: { color: 'black' } },
            min: Math.min(0, ...seriesData) * 1.5,
            max: Math.max(0, ...seriesData) * 1.5
        },
        tooltip: {
            shared: true,
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            title: { text: 'Legend' },
            margin: 60,
            labelFormat:
                '<i class="fa fa-check" aria-hidden="true" style="color:{color}"></i> {name}',
            useHTML: true,
            symbolHeight: 0.1,
            symbolWidth: 0.1,
            symbolPadding: 0
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
                type: 'spline',
                pointPadding: 0.1,
                groupPadding: 0.1,
                color: '#666666',
                marker: { enabled: true }
            }
        ]
    };

    const miniConfig = {
        chart: {
            height: 130,
            width: 250,
            zoomSlider: null,
            spacingBottom: 5,
            spacingLeft: 5,
            spacingTop: 5,
            spacingRight: 5
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        xAxis: {
            lineWidth: 0,
            crosshair: true,
            tickLength: 0,
            labels: {
                style: {
                    fontSize: '10px'
                }
            }
        },
        yAxis: {
            gridLineWidth: 0,
            labels: {
                enabled: false
            },
            title: {
                text: ''
            }
        },
        title: {
            text: `${variable} at ${stationData.station_name}, ${
                stationData.start_year
            } - ${stationData.end_year}`,
            style: { fontSize: '10px' }
        },
        plotOptions: {
            series: {
                pointStart: stationData.start_year
            }
        },
        series: [
            {
                name: period,
                data: seriesData,
                color: '#666666',
                type: 'line',
                lineWidth: 1,
                marker: {
                    radius: 2
                }
            }
        ]
    };

    return mini ? miniConfig : config;
}

export default makeConfig;
