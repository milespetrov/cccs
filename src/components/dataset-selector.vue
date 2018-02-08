<template>
    <b-dropdown :text="selectedDatasetShortName" variant="light" class="cip-dataset-selector">

        <div class="cip-dropdown-info">
            <h6 class="dropdown-header">Datasets</h6>
            <div class="cip-dropdown-description">Climate models use quantitative methods to simulate the interactions of the important drivers of climate, including atmosphere, oceans, land surface and ice. They are used for a variety of purposes from study of the dynamics of the climate system to projections of future climate.</div>
        </div>
        
        <b-dropdown-divider></b-dropdown-divider>

        <b-dropdown-item-button v-for="dataset in datasetItems" 
            @click="selectDataset(dataset)"
            :key="`dataset-${ dataset.id }`">
                <span class="cip-name">{{ dataset.name }}</span>
                <span class="cip-short-name">{{ dataset.shortName }}</span></b-dropdown-item-button>

    </b-dropdown>
    
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import api from './../api/main';
import { Dictionary } from 'vue-router/types/router';

interface DatasetItem {
    name: string;
    shortName: string;
    id: string;
}

@Component
export default class DatasetSelector extends Vue {
    datasetItems: DatasetItem[] = [
        {
            name: 'Coupled Model Intercomparison Project Phase 5',
            shortName: 'CMIP5',
            id: 'cmip5'
        },
        {
            name: 'Adjusted and homogenized Canadian Climate Data',
            shortName: 'AHCCD',
            id: 'ahccd'
        },
        {
            name: 'Canadian Gridded Temperature and Precipitation Anomalies',
            shortName: 'CANGRD',
            id: 'cangrd'
        }
    ];

    @Action setDatasetId: (value: string) => void;

    @State datasetId: string;

    @Getter getQuery: Dictionary<string>;

    get selectedDatasetShortName(): string {
        return `Dataset: ${
            this.datasetItems.find(dataset => dataset.id === this.datasetId)!
                .shortName
        }`;
    }

    selectDataset(dataset: DatasetItem) {
        this.setDatasetId(dataset.id);

        this.updateRoute();
    }

    updateRoute(): void {
        this.$router.push({
            name: this.$router.currentRoute.name,
            query: this.getQuery
        });
    }
}
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';
@import './../styles/view-controls.scss';

.cip-dataset-selector {
    .dropdown-item {
        display: flex;
        align-items: center;
    }

    .cip-name {
        flex: 1;
        margin-right: 3rem;
    }

    .cip-short-name {
        font-size: 0.7em;
        font-weight: 100;
    }
}
</style>
