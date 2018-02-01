<template>
    <div id="map-anchor"></div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State } from 'vuex-class';

import sprintf from 'sprintf-js';

interface tooltips {
    'en-CA': { [key: string]: { [key: string]: string } };
    'fr-CA': { [key: string]: { [key: string]: string } };
    [key: string]: { [key: string]: { [key: string]: string } };
}

@Component
export default class MapInstance extends Vue {
    tooltipTemplates: tooltips = {
        'en-CA': {
            ahccd: {
                'mean-temp':
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                'min-temp':
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                'max-temp':
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>",
                precip:
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />Trend value (annual): %(value)s</span></div>"
            }
        },
        'fr-CA': {
            ahccd: {
                'mean-temp':
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                'min-temp':
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                'max-temp':
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>",
                precip:
                    "<div class=' rv-tooltip-content'><span class='rv-tooltip-text'>Station: %(name)s<br />La valeur des tendances (annuel): %(value)s</span></div>"
            }
        }
    };

    get anchor(): HTMLElement {
        return document.getElementById('map-anchor')!;
    }

    @State('variableId') currentVariable: string;
    @State('datasetId') currentDataset: string;

    mounted(): void {
        let RZ = (<any>window).RZ;
        // TODO: link to a language choice; property, or stored value, or button
        let lang = 'en-CA';
        // TODO: link once dataSet selector is finalized
        let dataSet = 'ahccd';

        if (!RZ) {
            return;
        }

        if (this.currentVariable === null || this.currentDataset === null) {
            return;
        }

        new RZ.Map(
            this.anchor,
            `./assets/configs/config-${
                this.currentDataset
            }-${this.currentVariable.replace(/_/g, '-')}.en-CA.json`
        );

        let tooltip;
        RZ.mapAdded.subscribe(() => {
            RZ.mapInstances[
                RZ.mapInstances.length - 1
            ].ui.tooltip.mouseOver.subscribe((z: any) => {
                z.event.preventDefault();
                z.attribs.then((a: any) => {
                    const name = a.station_name_nom;
                    const value = Intl.NumberFormat(lang).format(
                        a.Annual_Annuel
                    );
                    const currentTemplate = this.tooltipTemplates[lang][
                        dataSet
                    ][this.currentVariable!];
                    tooltip = z.add(
                        sprintf.sprintf(currentTemplate, <any>{ name, value })
                    );
                });
            });
        });
    }
}
</script>

<style lang="scss" scoped>

</style>
