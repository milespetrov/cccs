export interface AppState {
    timePeriodId: string | null;
    variableId: string | null;
    datasetId: string | null;
    stationId: string | null;
    centerPoint: CenterPoint | null;
    zoomLevel: string | null;

    mapPin: CenterPoint | null;
}

export class CenterPoint {
    constructor(public x: number, public y: number) {}

    get safeString(): string {
        return `${this.x.toString()},${this.y.toString()}`;
    }
}
