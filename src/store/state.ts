export interface AppState {
    currentView: string | undefined;
    timePeriodId: string | undefined;
    variableId: string | undefined;
    datasetId: string | undefined;
    featureId: string | undefined;
    featurePoint: MapPoint | undefined;
    rcpId: string | undefined;
    centerPoint: MapPoint | undefined;
    zoomLevel: string | undefined;
    chartRange: Range | undefined;
    chartSeries: string | undefined;

    mapPin: MapPoint | undefined;
}

export class MapPoint {
    constructor(public x: number, public y: number) { }

    get safeString(): string {
        return `${this.x.toString()},${this.y.toString()}`;
    }
}

export class Range {
    constructor(public min: number, public max: number) { }

    get safeString(): string {
        return `${this.min.toString()},${this.max.toString()}`;
    }
}
