import api, { cmip5Api } from './../../api/';
import mappings from './../../globals/mappings';
import { BuilderDetails } from './builders';

async function makeConfig(details: BuilderDetails) {
    const data = await cmip5Api.getData(details.period, details.variable, details.featureId);

    const seriesData = data.models['rcp8.5'].ann['50'].anomaly.map((value: any) => {
        if (value && value > -9999) {
            return +value.toFixed(2);
        } else {
            return null;
        }
    });

    const seriesData25 = seriesData.map((value: any) => {
        return [value - (Math.random() * 10 + 2.5), value + (Math.random() * 10 + 2.5)];
    });

    const seriesData5 = seriesData25.map((value: any) => {
        return [value[0] - (Math.random() * 15 + 1.5), value[1] + (Math.random() * 15 + 1.5)];
    });

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
        },
        {
            name: 'Surface Wind Speed',
            id: 'surface_wind',
            unit: '%'
        }
    ];

    const item = variables.find((v: { id: string }) => v.id === details.variable);
    details.variable = item ? (<any>item).name : details.variable;

    const config = {
        chart: {
            backgroundColor: '#f9f9f9',
            zoomType: 'x',
            zoomSlider: {
                step: 1
            },
            marginRight: 265,
            events: {
                load: (event: any) => {
                    makeLabels(event, data);
                }
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
            text: `${details.variable} at ${data.grid_id},
             ${data.start_year} - ${data.end_year}`,
            x: -110
        },
        subtitle: {
            text: 'climate-adaptation.canada.ca',
            x: -110
        },
        xAxis: {
            // categories: details.data.Year_Annee,
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

                    details.callbacks.xaxis.events.setExtremes(event);
                }
            }
        },
        yAxis: {
            title: {
                text: `${details.variable}, %`
            },
            labels: { style: { color: 'black' } }
        },
        tooltip: {
            shared: true,
            valueSuffix: `%`
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
            x: -62,
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
                pointStart: data.start_year,
                events: {
                    hide: () => {
                        if (!api.DQV.charts.dvChart1.highchart.series.some((series: any) => series.visible)) {
                            api.DQV.sections.dvSection1.data.isTable = false;
                        }

                        details.callbacks.plotOptions.series.events.hide(
                            getVisibleSeries(api.DQV.charts.dvChart1.highchart)
                        );
                    },
                    show: () => {
                        api.DQV.sections.dvSection1.data.isTable = true;

                        details.callbacks.plotOptions.series.events.show(
                            getVisibleSeries(api.DQV.charts.dvChart1.highchart)
                        );
                    }
                }
            }
        },
        series: [
            {
                name: 'Ensemble Median',
                data: seriesData,
                type: 'line',
                pointPadding: 0.1,
                groupPadding: 0.1,
                zIndex: 2,
                color: '#34495e',
                marker: { enabled: true },
                events: {
                    legendItemClick: () => false
                },
                visible: details.chartSeries ? details.chartSeries.includes(0) : true
            },
            {
                name: '25th, 75th Percentiles',
                data: seriesData25,
                type: 'arearange',
                zIndex: 1,
                color: '#6D8398',
                marker: { enabled: false },
                visible: details.chartSeries ? details.chartSeries.includes(1) : true
            },
            {
                name: '5th, 95th Percentiles',
                data: seriesData5,
                type: 'arearange',
                zIndex: 0,
                color: '#8DA3B8',
                marker: { enabled: false },
                visible: details.chartSeries ? details.chartSeries.includes(2) : true
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

                    ren
                        .label('Click to see chart', event.target.chartWidth - 120, 5)
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
            text: `${details.variable} at ${data.grid_id}, ${data.start_year} - ${data.end_year}`,
            style: { fontSize: '10px' }
        },
        plotOptions: {
            series: {
                pointStart: data.start_year
            }
        },
        tooltip: {
            positioner: () => {
                return { x: 0, y: 0 };
            },
            shadow: false,
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0.8)'
        },
        series: [
            {
                name: 'Ensemble Median',
                data: seriesData,
                type: 'line',
                pointPadding: 0.1,
                groupPadding: 0.1,
                zIndex: 2,
                color: '#666666',
                marker: { enabled: false }
            },
            {
                name: '25th, 75th Percentiles',
                data: seriesData25,
                type: 'arearange',
                zIndex: 1,
                color: '#959595',
                marker: { enabled: false }
            },
            {
                name: '5th, 95th Percentiles',
                data: seriesData5,
                type: 'arearange',
                zIndex: 0,
                color: '#B5B5B5',
                marker: { enabled: false }
            }
        ]
    };
    return details.mini ? miniConfig : config;
}

function makeLabels(event: any, data: any) {
    const firstLabelY = 145;
    const ren = event.target.renderer;

    ren
        .path([
            'M',
            event.target.plotWidth + event.target.plotLeft + 35,
            0,
            'L',
            event.target.plotWidth + event.target.plotLeft + 35,
            event.target.plotTop + event.target.plotHeight + 100
        ])
        .attr({
            'stroke-width': 0.5,
            stroke: '#AAAAAA',
            padding: 15
        })
        .add();

    ren
        .label(`<b>Key Information</b>`, event.target.plotWidth + event.target.plotLeft + 55, firstLabelY)
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

    ren
        .label(
            `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis neque metus. Nunc enim velit, malesuada vitae vehicula vel, suscipit et neque. Donec ac ante sit amet nunc tristique interdum.`,
            event.target.plotWidth + event.target.plotLeft + 55,
            firstLabelY + 25
        )
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
}

/**
 * Gets the visible series in a chart
 *
 * @param chart The chart to look at
 * @returns An array of indices of visible series
 */
function getVisibleSeries(chart: any): number[] {
    const visible: number[] = [];
    chart.series.forEach((series: any) => {
        if (series.visible) {
            visible.push(series.index);
        }
    });
    return visible;
}

export default makeConfig;
