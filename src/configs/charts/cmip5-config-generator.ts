import api from '@/api/';
import { AppState } from '@/store';

import { ChartConfigCallbacks, ChartConfigGenerator } from './types';
import { ChartConfigType, DatasetId } from '@/types';
import { datasetApis } from '@/api';

import { formatLatLong } from '@/globals/utils';
import { removeTooltip } from './util';

async function makeConfig(
    state: AppState,
    chartConfigType: ChartConfigType,
    callbacks: ChartConfigCallbacks
): Promise<any> {
    const cmip5Api = datasetApis[DatasetId.CMIP5];
    const { timePeriodId, rcpId, featureId, featurePoint } = state;
    let { variableId } = state;

    // chartSeries default to `null` which cannot be used as non-value in a desctructuring statement
    const chartSeries = state.chartSeries || [0, 1, 2];

    if (!timePeriodId || !variableId || !chartSeries || !featureId || !rcpId || !featurePoint) {
        console.error('cannot generate chart config, parameters are not set');

        return null;
    }

    // get chart data
    const data = await cmip5Api.getData(timePeriodId, variableId, featureId, rcpId);

    const actualData = data.properties.models[rcpId][cmip5Api.periodMappings[timePeriodId]];

    const seriesData = actualData['50'].anomaly.map((value: any) => {
        return value ? parseInt(value.toFixed(2)) : value;
    });

    // zip the 25th & 75th percentiles
    const seriesData25 = actualData['25'].anomaly.map((value: any, index: number) => {
        return [
            value ? +value.toFixed(2) : value,
            actualData['75'].anomaly[index] ? parseInt(actualData['75'].anomaly[index].toFixed(2)) : null
        ];
    });

    // zip the 5th & 95th percentiles
    const seriesData5 = actualData['5'].anomaly.map((value: any, index: number) => {
        return [
            value ? +value.toFixed(2) : value,
            actualData['95'].anomaly[index]
                ? parseInt(actualData['95'].anomaly[index].toFixed(2))
                : actualData['95'].anomaly[index]
        ];
    });

    // HACK: get a proper variable name
    // should be retrieved from the store
    const variables: object[] = [
        {
            name: 'Surface Wind Speed',
            id: 'sfcwind',
            unit: '%'
        },
        {
            name: 'Sea Ice Thickness',
            id: 'sit',
            unit: '%'
        },
        {
            name: 'Sea Ice Concentration',
            id: 'sic',
            unit: '%'
        },
        {
            name: 'Snow Depth',
            id: 'snow_depth',
            unit: '%'
        }
    ];

    const item = variables.find((v: { id: string }) => v.id === variableId);
    // TODO: what does that do?
    variableId = item ? (<any>item).name : variableId;

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
            text: `${variableId} at ${titleLatLong(featurePoint.x, featurePoint.y)}, 1900 - 2100`,
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

                    callbacks.setExtremes(event);
                }
            }
        },
        yAxis: {
            title: {
                text: `${variableId}, %`
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
                pointStart: 1900,
                events: {
                    hide: () => {
                        if (!api.DQV.charts.dvChart1.highchart.series.some((series: any) => series.visible)) {
                            api.DQV.sections.dvSection1.data.isTable = false;
                        }

                        callbacks.hide(getVisibleSeries(api.DQV.charts.dvChart1.highchart));
                    },
                    show: () => {
                        api.DQV.sections.dvSection1.data.isTable = true;

                        callbacks.show(getVisibleSeries(api.DQV.charts.dvChart1.highchart));
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
                marker: { enabled: false },
                events: {
                    legendItemClick: () => false
                },
                visible: chartSeries.includes(0),
                lineWidth: 2.3
            },
            {
                name: '25th, 75th Percentiles',
                data: seriesData25,
                type: 'arearange',
                zIndex: 1,
                color: '#647990',
                marker: { enabled: false },
                visible: chartSeries.includes(1),
                fillOpacity: 0.5,
                lineWidth: 0
            },
            {
                name: '5th, 95th Percentiles',
                data: seriesData5,
                type: 'arearange',
                zIndex: 0,
                color: '#98adc6',
                marker: { enabled: false },
                visible: chartSeries.includes(2),
                fillOpacity: 0.5,
                lineWidth: 0
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
            text: `${variableId} at ${titleLatLong(featurePoint.x, featurePoint.y)}, 1900 - 2100`,
            style: { fontSize: '10px' }
        },
        plotOptions: {
            series: {
                pointStart: 1900
            }
        },
        tooltip: {
            positioner: () => {
                return { x: 0, y: 10 };
            },
            shadow: false,
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0)',
            shared: false,
            valueSuffix: '%'
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
                marker: { enabled: false },
                enableMouseTracking: false
            },
            {
                name: '5th, 95th Percentiles',
                data: seriesData5,
                type: 'arearange',
                zIndex: 0,
                color: '#B5B5B5',
                marker: { enabled: false },
                enableMouseTracking: false
            }
        ]
    };

    const chartTypeMap = {
        [ChartConfigType.FOCUS]: config,
        [ChartConfigType.GLANCE]: miniConfig
    };

    return chartTypeMap[chartConfigType];
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

/**
 * Returns a formatted latlong string for use in chart titles, uses the 'formatLatLong' utils function
 *
 * @param long
 * @param lat
 */
function titleLatLong(long: number, lat: number): string {
    const { x, y } = formatLatLong(long, lat);
    return `${y} ${lat > 0 ? 'N' : 'S'}, ${x} ${long > 0 ? 'E' : 'W'}`;
}
class CMIP5ChartConfigGenerator extends ChartConfigGenerator {
    make(chartConfigType: ChartConfigType, callbacks?: ChartConfigCallbacks): Promise<any> {
        super.make(chartConfigType, callbacks);

        return makeConfig(this.state, chartConfigType, this.callbacks);
    }
}

export default function(state: AppState) {
    return new CMIP5ChartConfigGenerator(state);
}
