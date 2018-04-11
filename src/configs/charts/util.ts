export function removeTooltip(target: any): void {
    const title = $(`#highcharts-title-${target.index}`);
    const titleText = target.title.textStr;
    const roots = document.getElementsByClassName('highcharts-root');
    roots.item(roots.length - 1).addEventListener('mouseenter', () => {
        title.text('');
    });
    roots.item(roots.length - 1).addEventListener('mouseleave', () => {
        title.text(titleText);
    });
}
