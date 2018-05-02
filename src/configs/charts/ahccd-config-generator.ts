import api, { datasetApis } from '@/api/';
import { AppState, Range } from '@/store';
import mappings from '@/globals/mappings';

import { ChartConfigCallbacks, ChartConfigGenerator } from './types';
import { ChartConfigType, DatasetId, VariableId } from '@/types';

import { removeTooltip } from './util';

async function makeConfig(
    state: AppState,
    chartConfigType: ChartConfigType,
    callbacks: ChartConfigCallbacks
): Promise<any> {
    const ahccdApi = datasetApis[DatasetId.AHCCD](state);
    const { timePeriodId, variableId, featureId, chartRange } = state;

    if (!timePeriodId || !variableId || !featureId) {
        console.error('cannot generate chart config, parameters are not set');

        return null;
    }

    // get chart data
    const data = await ahccdApi.getData();

    const seriesData = data.absolute_values.map((value: number) => (value > -9999 ? value : null));

    let trendRangeLabel: SVGElement;
    let startRange;

    // if the chart range is not set we want to start the chart at the normal start and end of the data
    if (!chartRange) {
        startRange = {
            min: data.data_years.start,
            max: data.data_years.end
        };
    } else {
        startRange = chartRange;
    }

    // HACK: get a proper variable name
    // should be retrieved from the store
    const variables: object[] = [
        {
            name: 'Mean Temperature',
            id: VariableId.TMean,
            unit: '°C'
        },
        {
            name: 'Minimum Temperature',
            id: VariableId.TMin,
            unit: '°C'
        },
        {
            name: 'Maximum Temperature',
            id: VariableId.TMax,
            unit: '°C'
        },
        {
            name: 'Precipitation',
            id: VariableId.Precipitation,
            unit: 'mm'
        }
    ];

    const variable: any = variables.find((v: { id: string }) => v.id === variableId);

    const config = {
        chart: {
            backgroundColor: '#f9f9f9',
            zoomType: 'x',
            zoomSlider:
                variableId === VariableId.Precipitation
                    ? null
                    : {
                          step: 1,
                          start: [startRange.min, startRange.max]
                      },
            marginRight: 265,
            events: {
                load: (event: any) => {
                    trendRangeLabel = makeLabels(event, data, featureId, variableId);
                    removeTooltip(event.target);
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
            text: `${variable.name} at ${data.station_name},
             ${data.data_years.start} - ${data.data_years.end}`,
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
                setExtremes: async (event: any) => {
                    console.log(event, event.target);

                    callbacks.setExtremes(event);

                    const data = await ahccdApi.getTrend(event.min, event.max);
                    let trendValue: string;

                    // Makes sure we dont display old info
                    if (`${event.min},${event.max}` !== state.chartRange!.safeString) {
                        return;
                    }

                    console.log(data);

                    if (!data.value) {
                        trendValue = 'Not Available';
                    } else {
                        trendValue = (data.value > 0 ? '+' : '') + +data.value.toFixed(4) + '°C';
                    }
                    if (variableId !== VariableId.Precipitation) {
                        (<any>trendRangeLabel).textSetter(
                            `Selection: <b>${trendValue}</b> for the ${event.min}-${event.max} period.`
                        );
                    }
                }
            }
        },
        yAxis: {
            title: {
                text: `${variable.name}, ${variable.unit}`
            },
            labels: { style: { color: 'black' } },
            min: Math.min(0, ...seriesData) * 1.5,
            max: Math.max(0, ...seriesData) * 1.5
        },
        tooltip: {
            shared: true,
            valueDecimals: 1
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
            y: 30,
            x: -128,
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
                pointStart: data.data_years.start,
                events: {
                    hide: () => {
                        if (!api.DQV.charts.dvChart1.highchart.series.some((series: any) => series.visible)) {
                            api.DQV.sections.dvSection1.data.isTable = false;
                        }
                    },
                    show: () => (api.DQV.sections.dvSection1.data.isTable = true)
                }
            }
        },
        series: [
            {
                name: `${mappings.periodToNames[timePeriodId]}, ${variable.unit}`,
                data: seriesData,
                type: 'spline',
                pointPadding: 0.1,
                groupPadding: 0.1,
                lineWidth: 2,
                color: '#34495e',
                cropThreshold: 1, // workaround for https://github.com/highcharts/highcharts/issues/7913
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

                    ren
                        .label('click to see the full chart', event.target.chartWidth / 2 - 65, 5)
                        .css({
                            display: 'none'
                        })
                        .addClass('click-hint')
                        .add();

                    removeTooltip(event.target);
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
            text: `${variable.name} at ${data.station_name}, ${data.data_years.start} - ${data.data_years.end}`,
            style: { fontSize: '10px' }
        },
        plotOptions: {
            series: {
                pointStart: data.data_years.start
            }
        },
        tooltip: {
            positioner: () => {
                return { x: 0, y: 10 };
            },
            shadow: false,
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0)',
            valueDecimals: 1
        },
        series: [
            {
                name: `${mappings.periodToNames[timePeriodId]}, ${variable.unit}`,
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

    const chartTypeMap = {
        [ChartConfigType.FOCUS]: config,
        [ChartConfigType.GLANCE]: miniConfig
    };

    return chartTypeMap[chartConfigType];
}

function makeLabels(event: any, data: any, featureId: string, variableId: string) {
    const firstLabelY = 135;
    const stationTrendValue = data.trend.value ? data.trend.value : 'N/A';
    const ren = event.target.renderer;

    const firstTrend =
        stationTrendValue === 'N/A'
            ? 'Not Available'
            : (stationTrendValue > 0 ? '+' : '') +
              +stationTrendValue.toFixed(4) +
              (variableId === VariableId.Precipitation ? '%' : '°C');
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
        .label('<b>Trends</b>', event.target.plotWidth + event.target.plotLeft + 55, firstLabelY)
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
            `Overall: <b>${firstTrend}</b> for the ${data.data_years.start}-${data.data_years.end} period`,
            event.target.plotWidth + event.target.plotLeft + 55,
            firstLabelY + 25
        )
        .css({
            width: 200,
            color: 'black' //'#ecf0f1'
        })
        .attr({
            //fill: '#222222',
            padding: 7,
            zIndex: 6
        })
        .add();

    const trendRangeLabel = ren
        .label(``, event.target.plotWidth + event.target.plotLeft + 55, firstLabelY + 58)
        .css({
            width: 200,
            color: 'black' //'#ecf0f1'
        })
        .attr({
            //fill: '#222222',
            padding: 7,
            zIndex: 6
        })
        .add();

    ren
        .label(`<b>Key Information</b>`, event.target.plotWidth + event.target.plotLeft + 55, firstLabelY + 110)
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
            `AHCCD Station ID: <b>${featureId}</b>`,
            event.target.plotWidth + event.target.plotLeft + 55,
            firstLabelY + 135
        )
        .css({
            width: 200,
            color: 'black' //'#ecf0f1'
        })
        .attr({
            //fill: '#222222',
            padding: 7,
            zIndex: 6
        })
        .add();

    return trendRangeLabel;
}

class AHCCDChartConfigGenerator extends ChartConfigGenerator {
    make(chartConfigType: ChartConfigType, callbacks?: ChartConfigCallbacks): Promise<any> {
        super.make(chartConfigType, callbacks);

        return makeConfig(this.state, chartConfigType, this.callbacks);
    }
}

export default function(state: AppState) {
    return new AHCCDChartConfigGenerator(state);
}
