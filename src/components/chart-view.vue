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

        Selected variable: {{ currentVariable }} <br>
        Selected dataset: {{ currentDataset }} <br>
        Selected time period: {{ currentTimePeriod }}<br>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import api from './../api/main';
import ahccdTemp from './../configs/chart/ahccd-temp';

import {
    rIsVariableSelectorOpen,
    cToggleVariableSelector,
    rVariableId,
    rDatasetId,
    rTimePeriodId
} from './../store/modules/app';

@Component
export default class ChartView extends Vue {
    get currentTimePeriod(): string {
        return rTimePeriodId(this.$store);
    }

    @Watch('currentTimePeriod')
    onTimePeriodChanged(): void {
        console.log('onTimePeriodChange', this.currentTimePeriod);

        this.updateDQV();
    }

    get currentVariable(): string {
        return rVariableId(this.$store);
    }

    @Watch('currentVariable')
    onCurrentVariableChanged(): void {
        console.log('onTimePeriodChange', this.currentVariable);

        this.updateDQV();
    }

    get currentDataset(): string {
        return rDatasetId(this.$store);
    }

    private data: any[];

    private userTrendValue: SVGElement;

    async mounted(): Promise<void> {
        if (!this.data) {
            this.data = await api.getData(
                this.currentTimePeriod,
                this.currentVariable,
                this.currentDataset
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
        this.data = await api.getData(
            this.currentTimePeriod,
            this.currentVariable,
            this.currentDataset
        );

        const config = this.makeConfig(
            this.data,
            this.currentTimePeriod,
            this.currentVariable
        );

        const dvChart = api.DQV.charts['dvChart1'];
        dvChart.config = config;

        (<any>window).wb.add('summary');
        (<any>window).wb.add('table');
    }

    makeConfig(
        data: any,
        period: string,
        variable: string,
        stnid: number = 1171393
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
</style>
