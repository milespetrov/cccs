function makeConfig(
    stationData: any,
    period: string,
    variable: string,
    stnid: number = 1171393
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
            id: 'mean-temp'
        },
        {
            name: 'Minimum Temperature',
            id: 'min-temp'
        },
        {
            name: 'Maximum Temperature',
            id: 'max-temp'
        },
        {
            name: 'Precipitation',
            id: 'precip'
        }
    ];

    const item = variables.find((v: { id: string }) => v.id === variable);
    variable = item ? (<any>item).name : variable;

    const gradients = {
        precip: { linearGradient: [0, 0, 0, 400],
            stops: [
                [0, 'rgb(36, 100, 164)'],
                [0.1, 'rgb(55, 119, 183)'],
                [0.2, 'rgb(75, 139, 203)'],
                [0.3, 'rgb(95, 159, 223)'],
                [0.4, 'rgb(115, 179, 243)'],
                [0.5, 'rgb(135, 199, 199)'],
                [0.6, 'rgb(155, 219, 219)'],
                [0.7, 'rgb(175, 239, 239)'],
                [0.8, 'rgb(195, 195, 195)'],
                [0.9, 'rgb(215, 215, 215)'],
                [1, 'rgb(235, 235, 235)']
        ]},
        temp: { linearGradient: [0, 400, 0, 0],
            stops: [
                [0, 'rgba(0, 0, 127, 0.5)'],
                [0.1, 'rgba(0, 0, 197, 0.5)'],
                [0.2, 'rgba(0, 20, 255, 0.5)'],
                [0.3, 'rgba(0, 126, 255, 0.5)'],
                [0.4, 'rgba(0, 233, 255, 0.5)'],
                [0.5, 'rgba(67, 255, 186, 0.5)'],
                [0.6, 'rgba(152, 255, 101, 0.5)'],
                [0.7, 'rgba(237, 255, 16, 0.5)'],
                [0.8, 'rgba(255, 186, 0, 0.5)'],
                [0.9, 'rgba(255, 59, 0, 0.5)'],
                [1, 'rgba(197, 0, 0, 0.5)']
        ]},
        test: { linearGradient: [0, 0, 0, 300],
        stops: [
            [0, '#003D79' ],
            [1, 'rgba(255,255,255,0)']
        ]}
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
                            color: 'black'//'#ecf0f1'
                        })
                        .attr({
                            //fill: '#222222',
                            padding: 7,
                            zIndex: 6
                        })
                        .add();

                    // draw the second trend value
                    secondTrendValueLabel = ren
                        .label(
                            ``,
                            650,
                            85
                        )
                        .css({
                            color: 'black'//'#ecf0f1'
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
            labels:{style:{color:'black'}},
            minRange: 20,
            minPadding: 20,
            crosshair: true,
            gridLineWidth: 1,
            events: {
                setExtremes: (event: any) => {
                    console.log(event, event.target);

                    $.getJSON(`http://ahccd-dev.azurewebsites.net/${stnid}/${variable}/${period}/trend/${event.min}/${event.max}`, (data) => { 
                        console.log(data);
                        (<any>secondTrendValueLabel).textSetter(
                            `User range (${event.min}-${event.max}): <b>${(<any>data).trend.value}</b>`
                        );
                    });
                    
                }
            }
        },
        yAxis: {
            title: {
                text: `${variable}, °C`
            },
            labels:{style:{color:'black'}},
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
            verticalAlign: 'middle',
            title: {text: 'Legend'},
            margin: 60,
            labelFormat: '<i class="fa fa-check" aria-hidden="true" style="color:{color}"></i> {name}',
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
                marker: {enabled: true}
            }
        ]
    };

    return config;
}

export default makeConfig;
