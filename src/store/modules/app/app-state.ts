import { DatasetId } from '@/types';

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
    analysisPeriod: string | null;
    layerVisibility: {
        cities: boolean | null;
        labels: boolean | null;
        provinces: boolean | null;
    };
    lastClick: XY | null;

    internalRouteUpdate: boolean;
}

export class MapPoint {
    constructor(public x: number, public y: number) {}

    get safeString(): string {
        return `${this.x.toString()},${this.y.toString()}`;
    }
}

export class XY {}