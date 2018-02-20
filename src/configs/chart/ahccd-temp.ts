import api from './../../api/main';

interface period_mappings {
    [key: string]: number;
}

function makeConfig(
    stationData: any,
    period: string,
    variable: string,
    stnid: string,
    mini: boolean = false
) {
    const seriesData = stationData.absolute_values.map(
        (value: number) => (value > -9999 ? value : null)
    );

    let secondTrendValueLabel: HTMLElement;
    let trendRangeLabel: SVGElement;

    // HACK: get a proper variable name
    // should be retrieved from the store
    const variables: object[] = [
        {
            name: 'Mean Temperature',
            id: 'tmean',
            unit: '°C'
        },
        {
            name: 'Minimum Temperature',
            id: 'tmin',
            unit: '°C'
        },
        {
            name: 'Maximum Temperature',
            id: 'tmax',
            unit: '°C'
        },
        {
            name: 'Precipitation',
            id: 'precip',
            unit: 'mm'
        }
    ];

    const fancyNames: object = {
        Jan_Janv: 'January',
        Feb_Fev: 'February',
        Mar_March: 'March',
        Apr_Avr: 'April',
        May_Mai: 'May',
        June_Juin: 'June',
        July_Juil: 'July',
        Aug_Aout: 'August',
        Sept_Sept: 'September',
        Oct_Oct: 'October',
        Nov_Nov: 'November',
        Dec_Dec: 'December',
        Winter_Hiver: 'Winter',
        Spring_Printemp: 'Spring',
        Summer_Ete: 'Summer',
        Autumn_Autome: 'Autumn',
        Annual_Annuel: 'Annual'
    };

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
            marginRight: 265,
            events: {
                load: (event: any) => { [trendRangeLabel, secondTrendValueLabel] = makeLabels(event, stationData)}
            },
            style: {
                fontFamily: 'inherit'
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
             ${stationData.data_years.start} - ${stationData.data_years.end}`,
            x: -110
        },
        subtitle: {
            text: 'climate-adaptation.canada.ca',
            x: -110
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
                            (<any>trendRangeLabel).textSetter(
                                `Selection (${event.min}-${event.max}):`
                            );
                            if (!data.value) {
                                (<any>secondTrendValueLabel).textSetter(
                                    `<b>Not Available</b>`
                                );
                            } else {
                                (<any>secondTrendValueLabel).textSetter(
                                    //(stationTrendValue == 'N/A' ? 'N/A' : (stationTrendValue > 0 ? '+' : '') + +stationTrendValue.toFixed(4))
                                    `<b>${((<any>data).value > 0 ? '+' : '') + +(<any>data).value.toFixed(4)}</b>`
                                );
                            }
                            (<any>secondTrendValueLabel).attr({
                                x: event.target.chart.chartWidth - (<any>secondTrendValueLabel).width + 6
                            });
                        }
                    );
                }
            }
        },
        yAxis: {
            title: {
                text: `${variable}, ${(<any>item!).unit}`
            },
            labels: { style: { color: 'black' } },
            min: Math.min(0, ...seriesData) * 1.5,
            max: Math.max(0, ...seriesData) * 1.5
        },
        tooltip: {
            shared: true,
            valueSuffix: `${(<any>item!).unit}`
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            title: {
                text: 'Legend',
                style: {
                    fontSize: '16px'
                }
            },
            y: 40,
            x: -128,
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
                pointStart: stationData.data_years.start,
                events: {
                    hide: () => {
                        if (!api.DQV.charts.dvChart1.highchart.series.some((series: any) => series.visible)){
                            api.DQV.sections.dvSection1.data.isTable = false;
                        }
                    },
                    show: () => {
                        api.DQV.sections.dvSection1.data.isTable = true;
                    }
                }
            }
        },
        series: [
            {
                name: (<any>fancyNames)[period],
                data: seriesData,
                type: 'spline',
                pointPadding: 0.1,
                groupPadding: 0.1,
                lineWidth: 2,
                color: '#34495e',
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
            spacingLeft: 10,
            spacingTop: 10,
            spacingRight: 10,
            style: {
                fontFamily: 'Helvetica,Arial,sans-serif'
            },
            events: {
                load: (event: any) => {
                    const ren = event.target.renderer;

                    ren.label(
                        'Click to see chart',
                        event.target.chartWidth - 120,
                        5
                    )
                    .css({
                        display: 'none'
                    })
                    .addClass('click-hint')
                    .add();
                }
            }
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
                stationData.data_years.start
            } - ${stationData.data_years.end}`,
            style: { fontSize: '10px' }
        },
        plotOptions: {
            series: {
                pointStart: stationData.data_years.start
            }
        },
        tooltip: {
            positioner: function() {
                return { x: 0, y: 0 };
            },
            shadow: false,
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0.8)'
        },
        series: [
            {
                name: (<any>fancyNames)[period],
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

function makeLabels(event:any, stationData:any){
    const firstLabelY = 145;
    const stationTrendValue = (stationData.trend.value ? stationData.trend.value : 'N/A');
    const ren = event.target.renderer;

    const firstTrend = (stationTrendValue == 'N/A' ? 'Not Available' : 
        (stationTrendValue > 0 ? '+' : '') + +stationTrendValue.toFixed(4));

    ren.path(
        ['M', event.target.plotWidth + event.target.plotLeft + 35, 0, 'L', event.target.plotWidth + event.target.plotLeft + 35, event.target.plotTop + event.target.plotHeight + 100]
    )
        .attr({
            'stroke-width': 0.5,
            stroke: '#AAAAAA',
            padding: 15
        })
        .add();

    ren.label('<b>Trends</b>',
        event.target.plotWidth + event.target.plotLeft + 55,
        firstLabelY)
        .css({
            'font-size': '16px',
            color: 'black' //'#ecf0f1'
        })
        .attr({
            //fill: '#222222',
            padding: 7,
            zIndex: 6
        })
        .add();


    // draw the first trend value
    ren
        .label(
        `Overall (${stationData.data_years.start}-${stationData.data_years.end}):`,
        event.target.plotWidth + event.target.plotLeft + 55,
        firstLabelY + 25
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
    let current = ren.label(
        `<b>${firstTrend}</b>`,
        null,
        firstLabelY + 25
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
    (<any>current).attr({
        x: event.target.chartWidth - (<any>current).width + 6
    });
    let trendRangeLabel = ren
        .label(
        ``,
        event.target.plotWidth + event.target.plotLeft + 55,
        firstLabelY + 45
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
    let secondTrendValueLabel = ren
        .label(``,
        event.target.plotWidth + event.target.plotLeft + 55,
        firstLabelY + 45)
        .css({
            color: 'black' //'#ecf0f1'
        })
        .attr({
            //fill: '#222222',
            padding: 7,
            zIndex: 6
        })
        .add();

    ren
        .label(
        `<b>Key Information</b>`,
        event.target.plotWidth + event.target.plotLeft + 55,
        firstLabelY + 110
        )
        .css({
            'font-size': '16px',
            color: 'black' //'#ecf0f1'
        })
        .attr({
            //fill: '#222222',
            padding: 7,
            zIndex: 6
        })
        .add()

    ren
        .label(
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis neque metus. Nunc enim velit, malesuada vitae vehicula vel, suscipit et neque. Donec ac ante sit amet nunc tristique interdum.`,
        event.target.plotWidth + event.target.plotLeft + 55,
        firstLabelY + 135)
        .css({
            'pointer-events': 'none',
            width: 200,
            color: 'black' //'#ecf0f1'
        })
        .attr({
            //fill: '#222222',
            padding: 7,
            zIndex: 6
        })
        .add();

    return [trendRangeLabel, secondTrendValueLabel];
}

export default makeConfig;
