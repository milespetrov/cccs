interface EnhancedWindow extends Window {
    $: typeof $;
    DQV: any;
    JSONGroupBy: any;
}

function getData(): Promise<any[]> {
    const promise = new Promise<any[]>((resolve, reject) => {
        $.getJSON(
            'https://ramp-pcar.github.io/dqvue/samples/AHCCD_Mean_Temp.json',
            (data: any[]) => resolve(data)
        );
    });

    return promise;
}

const DQV: any = (<EnhancedWindow>window).DQV;
const $: any = (<EnhancedWindow>window).$;
const JSONGroupBy = (<EnhancedWindow>window).JSONGroupBy;

export default { getData, DQV, $, JSONGroupBy };
