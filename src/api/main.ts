interface EnhancedWindow extends Window {
    $: typeof $;
    DQV: any;
    JSONGroupBy: any;
    RZ: any;
}

interface period_mappings {
    [key: string]: number;
}

function getData(
    timePeriod: string,
    variable: string,
    dataset: string,
    stnid: string
): Promise<any[]> {
    const period_mappings: period_mappings = {
        Jan_Janv: 1,
        Feb_Fev: 2,
        Mar_March: 3,
        Apr_Avr: 4,
        May_Mai: 5,
        June_Juin: 6,
        July_Juil: 7,
        Aug_Aout: 8,
        Sept_Sept: 9,
        Oct_Oct: 10,
        Nov_Nov: 11,
        Dec_Dec: 12,
        Winter_Hiver: 13,
        Spring_Printemp: 14,
        Summer_Ete: 15,
        Autumn_Autome: 16,
        Annual_Annuel: 17
    };

    const promise = new Promise<any[]>((resolve, reject) => {
        $.getJSON(
            `http://${dataset}-dev.azurewebsites.net/${stnid}/${variable}/${
                period_mappings[timePeriod]
            }`,
            (data: any[]) => resolve(data)
        );
    });

    return promise;
}

const DQV: any = (<EnhancedWindow>window).DQV;
const $: any = (<EnhancedWindow>window).$;
const RZ: any = (<EnhancedWindow>window).RZ;

export default { getData, DQV, $, RZ };
