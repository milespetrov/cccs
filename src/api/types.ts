import { AppState } from '@/store/modules/app';
import { getJSON } from '@/api/util';
import { DatasetId } from '@/types';

interface DatasetSourceWrapper {
    en: RAMPDatasetSource;
    fr: RAMPDatasetSource;
}

interface RAMPDatasetSource {
    legend: any;
    supportLayers: any;
    dataLayers: any;
}

export class DatasetApi {
    protected state: AppState;
    protected baseUrl: string = './assets/configs';
    protected id: DatasetId;

    // turn off custom tooltips by default
    tooltip: boolean = false;

    constructor(state: AppState, id: DatasetId) {
        this.state = state;
        this.id = id;
    }

    get fetchUrl(): string {
        throw new Error('fetchUrl is not implemented');
    }

    getTooltip(data: any): string | void {}

    async getDatasetSource(lang: string): Promise<RAMPDatasetSource> {
        const source = await getJSON<DatasetSourceWrapper>(this.fetchUrl, this.id, 'datasetSource', 10);
        return source[<'en' | 'fr'>lang];
    }
}

export interface EnhancedWindow extends Window {
    $: typeof $;
    RZ: any;
}
