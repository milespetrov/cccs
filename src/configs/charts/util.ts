/**
 * Hides the auto-tooltip on a chart svg by removing the title while hovering.
 * This tooltip gets in the way of actual information and doesn't add anything as the chart title is always visible.
 *
 * @param target the highcharts object that the SVG tooltip should be "removed" for
 */
export function removeTooltip(target: any): void {
    // the title element in the SVG
    const title = target.container.querySelector(`#highcharts-title-${target.index}`);
    // the charts title text, NOT the text of the title element above
    const titleText = target.title.textStr;
    target.container.addEventListener('mouseenter', () => {
        title.innerHTML = '';
    });
    target.container.addEventListener('mouseleave', () => {
        title.innerHTML = titleText;
    });
}
