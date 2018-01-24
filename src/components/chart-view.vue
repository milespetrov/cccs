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
        Selected time period: {{ timePeriod }}<br>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import api from './../api/main';
import ahccdTemp from './../configs/chart/ahccd-temp';

import {
    rIsVariableSelectorOpen,
    cToggleVariableSelector,
    rGetCurrentVariable,
    rGetCurrentDataset
} from './../store/modules/app';

@Component
export default class ChartView extends Vue {
    toggleVariableSelector(): void {
        const currentState = rIsVariableSelectorOpen(this.$store);
        cToggleVariableSelector(this.$store, !currentState);
    }

    @Prop() timePeriod: string;

    @Prop({ default: 'Temperature' })
    variable: string;

    get currentVariable(): string {
        return rGetCurrentVariable(this.$store);
    }

    get currentDataset(): string {
        return rGetCurrentDataset(this.$store);
    }

    @Watch('timePeriod')
    onTimePeriodChanged(): void {
        console.log('onTimePeriodChange', this.timePeriod);
        this.updateDQV();
    }

    private data: any[];

    private userTrendValue: SVGElement;

    async mounted(): Promise<void> {
        if (!this.data) {
            this.data = await api.getData(this.timePeriod);

            const config = this.makeConfig(this.data, this.timePeriod);
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
                        <summary>View data for this chart</summary>
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
        dvsection1.mount(document.getElementById('mount-point'));

        (<any>window).wb.add('summary');
        (<any>window).wb.add('table');
    }

    async updateDQV(): Promise<void> {
        this.data = await api.getData(this.timePeriod);

        const config = this.makeConfig(this.data, this.timePeriod);

        const dvChart = api.DQV.charts['dvChart1'];
        dvChart.config = config;

        (<any>window).wb.add('summary');
        (<any>window).wb.add('table');
    }

    makeConfig(data: any, period: string, stnid: number = 1171393): object {
        return ahccdTemp(data, period, stnid);
    }
}
</script>

<style lang="scss" scoped>

</style>
