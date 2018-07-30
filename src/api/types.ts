import { AppState } from '@/store';
import { getJSON } from '@/api/util';
import { DatasetId } from '@/types';

interface DatasetSourceWrapper {
    en: DatasetSource;
    fr: DatasetSource;
}

interface DatasetSource {
    legend: any;
    supportLayers: any;
    dataLayers: any;
}

export class DatasetApi {
    protected state: AppState;
    protected baseUrl: string = './assets/configs';
    protected id: DatasetId;

    protected version: string;

    isReady: Promise<any>;
    // turn off custom tooltips by default
    tooltip: boolean = false;

    constructor(state: AppState, id: DatasetId) {
        this.state = state;
        this.id = id;

        // get the current version number of the dataset
        // return the dataset class instance as the `isReady` Promise is resolved
        this.isReady = getJSON<{ version: string }>(`${this.baseUrl}/${this.id}/current.json`, this.id, 'version').then(
            data => (this.version = data.version)
        );
    }

    get fetchUrl(): string {
        throw new Error('fetchUrl is not implemented');
    }

    getTooltip(data: any): string | void {}

    async getDatasetSource(lang: string): Promise<DatasetSource> {
        await this.isReady;

        const source = await getJSON<DatasetSourceWrapper>(this.fetchUrl, this.id, 'datasetSource', 10);
        return source[<'en' | 'fr'>lang];
    }
}

export interface EnhancedWindow extends Window {
    $: typeof $;
    RZ: any;
}
