export interface AppState {
    isVariableSelectorOpen: boolean;

    timePeriodId: string | null;
    variableId: string | null;
    datasetId: string | null;
    stationId: string | null;
    centerPoint: CenterPoint | null;
}

export class CenterPoint {
    constructor(public x: number, public y: number) {}

    get safeString(): string {
        return `${this.x.toString()},${this.y.toString()}`;
    }
}
