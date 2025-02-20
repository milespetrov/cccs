<template>
    <select :value="datasetFilter" @input="updateDatasetFilter">
        <option :value="null">{{$t(`datasetFilter.all`)}}</option>
        <option v-for="option in options" :key="option" :value="option">{{$t(`datasetFilter.${option}`)}}</option>
    </select>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';

import { DatasetFilter } from '@/types';


const StateApp = namespace('app', State);
const GetterApp = namespace('app', Getter);
const ActionApp = namespace('app', Action);


@Component
export default class DatasetFilterV extends Vue {
    @ActionApp setDatasetFilter: (value: DatasetFilter | null) => void;
    @StateApp datasetFilter: DatasetFilter | null;

    options: DatasetFilter[] = [
        DatasetFilter.Temperature,
        DatasetFilter.Precipitation,
        DatasetFilter.Snow,
        DatasetFilter.Ice,
        DatasetFilter.WindSpeed,
        DatasetFilter.Pressure,
        DatasetFilter.Stations
    ]

    updateDatasetFilter(event: any): void {
        this.setDatasetFilter(event.target.value);
    }
}
</script>
