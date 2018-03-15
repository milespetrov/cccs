export interface DatasetApi {
    getData: (timePeriod: string, variable: string, featureId: string) => any;
}

export interface EnhancedWindow extends Window {
    $: typeof $;
    DQV: any;
    JSONGroupBy: any;
    RZ: any;
}
