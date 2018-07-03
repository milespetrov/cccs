import { AppState } from '@/store';

export class DatasetApi {
    protected state: AppState;

    constructor(state: AppState) {
        this.state = state;
    }
}

export interface EnhancedWindow extends Window {
    $: typeof $;
    DQV: any;
    RZ: any;
}
