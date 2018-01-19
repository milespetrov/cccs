interface EnhancedWindow extends Window {
    $: typeof $;
    DQV: any;
    JSONGroupBy: any;
}

function getData(timePeriod: string): Promise<any[]> {
    const promise = new Promise<any[]>((resolve, reject) => {
        $.getJSON(
            `http://ahccd-dev.azurewebsites.net/station/variable/${timePeriod}`,
            (data: any[]) => resolve(data)
        );
    });

    return promise;
}

const DQV: any = (<EnhancedWindow>window).DQV;
const $: any = (<EnhancedWindow>window).$;
const JSONGroupBy = (<EnhancedWindow>window).JSONGroupBy;

export default { getData, DQV, $, JSONGroupBy };
