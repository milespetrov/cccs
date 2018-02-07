<template>
    <div>
        <div v-if="false">
            <b-dropdown id="ddown1" text="Dropdown Button" class="m-md-2" right>
                <b-dropdown-item>First Action</b-dropdown-item>
                <b-dropdown-item>Second Action</b-dropdown-item>
                <b-dropdown-item>Third Action</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item>Something else here...</b-dropdown-item>
                <b-dropdown-item disabled>Disabled action</b-dropdown-item>
            </b-dropdown>
        </div>

        <div id="mount-point"></div>

        <!-- Selected variable: {{ currentVariable }} <br>
        Selected dataset: {{ currentDataset }} <br>
        Selected time period: {{ currentTimePeriod }}<br> -->

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State } from 'vuex-class';

import api from './../api/main';
import ahccdTemp from './../configs/chart/ahccd-temp';

@Component
export default class ChartView extends Vue {
    @State('timePeriodId') currentTimePeriod: string;

    @Watch('currentTimePeriod')
    onTimePeriodChanged(): void {
        this.updateDQV();
    }

    @State('variableId') currentVariable: string;

    @Watch('currentVariable')
    onCurrentVariableChanged(): void {
        this.updateDQV();
    }

    @State('datasetId') currentDataset: string;

    @State('stationId') currentStation: string;

    @Watch('currentStation')
    onCurrentStationChanged(): void {
        this.updateDQV();
    }

    private data: any[];

    private userTrendValue: SVGElement;

    /**
     * Keeps track of the internal state of the view. When `false`, no update should be initiated inside the component.
     */
    isActive: boolean = false;

    /**
     * `Activated` lifecycle hook.
     * https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
     */
    activated(): void {
        this.isActive = true;

        // trigger data update change
        this.updateDQV();
    }

    /**
     * `Activated` lifecycle hook.
     * https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
     */
    deactivated(): void {
        this.isActive = false;
    }

    async mounted(): Promise<void> {
        if (!this.data) {
            this.data = await api.getData(
                this.currentTimePeriod,
                this.currentVariable,
                this.currentDataset,
                this.currentStation
            );

            const config = this.makeConfig(
                this.data,
                this.currentTimePeriod,
                this.currentVariable
            );
            this.initDQV(config);
            return;
        }
    }

    initDQV(config: object): void {
        const data = {
            name: 'foobar'
        };

        const template = `
            <dv-section>
                <dv-chart id="dvChart1" dv-auto-generate-table>
                    <details>
                        <summary @click="window.wb.add('table')">View data for this chart</summary>
                        <div class="summary">
                            <dv-chart-table dv-auto-render dv-table-class="wb-tables table table-striped"></dv-chart-table>
                        </div>
                    </details>
                </dv-chart>
            </dv-section>
        `;

        const dvchart1 = new api.DQV.Chart({
            id: 'dvChart1',
            config
        });
        const dvsection1 = new api.DQV.Section({
            id: 'dvSection1',
            template,
            data
        });

        //window.setTimeout(() => {
        dvsection1.mount(document.getElementById('mount-point'));
        //}, 2000);

        (<any>window).wb.add('summary');
        /* (<any>window).wb.add('table'); */
    }

    async updateDQV(): Promise<void> {
        if (!this.isActive) {
            return;
        }

        this.data = await api.getData(
            this.currentTimePeriod,
            this.currentVariable,
            this.currentDataset,
            this.currentStation
        );

        const config = this.makeConfig(
            this.data,
            this.currentTimePeriod,
            this.currentVariable
        );

        const dvChart = api.DQV.charts['dvChart1'];
        dvChart.config = config;

        (<any>window).wb.add('summary');
        //(<any>window).wb.add('table');
    }

    makeConfig(
        data: any,
        period: string,
        variable: string,
        stnid: number = 1021830
    ): object {
        return ahccdTemp(data, period, variable, stnid);
    }
}
</script>

<style lang="scss" scoped>
/deep/ #dvChart1 [dv-chart-container] {
    margin: auto;
    height: 500px;
}
/deep/ .noUi-connect {
    background: #003d79 !important;
}

/deep/ .highcharts-legend-item-hidden .fa-check {
    color: inherit !important;
}
/deep/ [dv-chart-slider-container] {
    width:77%;
}
/deep/ #dvChart1 > details {
    width: 77%;
}
</style>
