import { ViewType, DatasetId } from '@/types';

export interface AppState {
    timePeriodId: string | null;
    variableId: string | null;
    datasetId: DatasetId | null;
    featureId: string | null;
    featurePoint: MapPoint | null;
    rcpId: string | null;
    centerPoint: MapPoint | null;
    locationPoint: MapPoint | null;
    zoomLevel: string | null;
    timeSlice: number | null;

    internalRouteUpdate: boolean;
}

export interface RootState {
    // app: AppState;
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
