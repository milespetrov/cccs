export interface DatasetApi {
    getData: (timePeriod: string, variable: string, featureId: string, rcpId?: string) => any;
    periodMappings: { [key: string]: string };
}

export interface EnhancedWindow extends Window {
    $: typeof $;
    DQV: any;
    JSONGroupBy: any;
    RZ: any;
}
