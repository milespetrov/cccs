export interface AppState {
    currentView: string | null;
    timePeriodId: string | null;
    variableId: string | null;
    datasetId: string | null;
    featureId: string | null;
    featurePoint: MapPoint | null;
    rcpId: string | null;
    centerPoint: MapPoint | null;
    zoomLevel: string | null;
    chartRange: Range | null;
    chartSeries: string | null;

    mapPin: MapPoint | null;
}

export class MapPoint {
    constructor(public x: number, public y: number) {}

    get safeString(): string {
        return `${this.x.toString()},${this.y.toString()}`;
    }
}

export class Range {
    constructor(public min: number, public max: number) {}

    get safeString(): string {
        return `${this.min.toString()},${this.max.toString()}`;
    }
}
