<template>
    <nav id="wb-sec" class="root wb-sec col-md-3 col-md-pull-9">
        <!-- VARIABLES -->

        <h2 class="wb-inv" id="wb-sec-h">Variable Selector</h2>

        <section class="list-group menu list-unstyled">
            <h3 class="header">
                <span> Variables </span>
                <button type="button" class="dataset-button" @click="datasetSelectorOpen = !datasetSelectorOpen">
                    Datasets
                    <i class="fas fa-caret-right fa-2x"></i>
                </button>

            </h3>

            <ul class="list-group menu list-unstyled">
                <div v-for="(set, index) in sets" :key="`${index}-set`">
                    <li @click="toggleSet(set)">
                        <a role="button" href="javascript:" class="list-group-item"
                            :class="{ 'wb-navcurr': selectedSetId === set.id, 'rotate': set.opened }">{{ set.name }} <i class="fas fa-chevron-down"></i></a>
                    </li>
                    <ul class="list-group list-unstyled" v-show="set.opened">
                        <li v-for="(variable, index) in set.variables" :key="`${index}-variable`"
                            @click="selectVariable(variable, set)">
                            <a role="button" href="javascript:" class="list-group-item"
                                :class="{ 'wb-navcurr': currentVariable === variable.id }" >{{ variable.name }}</a>
                        </li>
                    </ul>
                </div>
            </ul>
        </section>


        <!-- DATASETS -->
        <section v-show="datasetSelectorOpen" class="datasets list-group menu list-unstyled">
            <h3 class="header">
                <span>Datasets</span>
                <button type="button" class="dataset-button" @click="datasetSelectorOpen = !datasetSelectorOpen">
                    Datasets
                    <i class="fas fa-caret-left fa-2x"></i>
                </button>
            </h3>

            <ul class="list-group menu list-unstyled">
                <div v-for="(group, index) in datagroups" :key="`${index}-group`">
                    <li @click="toggleDatagroup(group)">
                        <a role="button" href="javascript:" class="list-group-item"
                            :class="{ 'wb-navcurr': currentDatagroup === group.id, 'rotate': group.opened }">{{ group.name }} <i class="fas fa-chevron-down"></i></a>
                    </li>
                    <ul class="list-group list-unstyled dataset-list" v-show="group.opened">
                        <li v-for="(dataset, index) in group.variables" :key="`${index}-dataset`"
                            @click="selectDataset(dataset, group)">
                            <a role="button" href="javascript:" class="list-group-item"
                                :class="{ 'wb-navcurr': currentDataset === dataset.id }" >{{ dataset.name }}</a>
                        </li>
                    </ul>
                </div>
            </ul>
        </section>
    </nav>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import api from './../api/main';
import { Dictionary } from 'vue-router/types/router';

interface VariableSet {
    name: string;
    id: string;
    variables: VariableItem[];
    opened: boolean;
}

interface VariableItem {
    name: string;
    id: string;
    // TODO: hack;
    // the dataset selector will likely move to the visualization controls menu
    datasetId?: string;
}

@Component
export default class VariableSelector extends Vue {
    sets: VariableSet[] = [
        {
            name: 'Historic',
            id: 'historic',
            variables: [
                {
                    name: 'Mean Temperature',
                    id: 'mean-temp',
                    datasetId: 'ahccd'
                },
                {
                    name: 'Minimum Temperature',
                    id: 'min-temp',
                    datasetId: 'ahccd'
                },
                {
                    name: 'Maximum Temperature',
                    id: 'max-temp',
                    datasetId: 'ahccd'
                },
                {
                    name: 'Precipitation',
                    id: 'precip',
                    datasetId: 'ahccd'
                }
            ],
            opened: true
        },
        {
            name: 'Projected',
            id: 'projected',
            variables: [
                { name: 'var1', id: 'var1', datasetId: 'other' },
                { name: 'var2', id: 'va2', datasetId: 'other' },
                { name: 'var3', id: 'va3', datasetId: 'other' }
            ],
            opened: true
        }
    ];

    datagroups: VariableSet[] = [
        {
            name: 'Blha',
            id: 'blah',
            variables: [
                { name: 'CIMP3', id: 'CIMP3' },
                { name: 'AHCCD', id: 'ahccd' }
            ],
            opened: false
        },
        {
            name: 'SET 2',
            id: 'set2',
            variables: [
                { name: 'dataset 1', id: 'd1' },
                { name: 'dataset 5', id: 'd5' }
            ],
            opened: false
        },
        {
            name: 'SET 3',
            id: 'set3',
            variables: [
                { name: 'dataset 2', id: 'd2' },
                { name: 'dataset 3', id: 'd3' }
            ],
            opened: false
        }
    ];

    @Action setTimePeriodId: (value: string) => void;
    @Action setVariableId: (value: string) => void;
    @Action setDatasetId: (value: string) => void;

    @State('variableId') currentVariable: string;
    @State('datasetId') currentDataset: string;

    @Getter getQuery: Dictionary<string>;

    get selectedSetId(): string {
        if (!this.currentVariable) {
            return '';
        }

        // find a variable set with the current variable
        const set = this.sets.find(
            set =>
                set.variables.find(
                    variable => variable.id === this.currentVariable
                ) !== undefined
        )!;

        return set.id;
    }
    currentDatagroup: string = '';

    datasetSelectorOpen: boolean = false;

    mounted(): void {
        /* const set = this.sets.find(set => set.id === 'historic')!;
        const variable = set.variables.find(
            variable => variable.id === 'ahccd_min_temp'
        )!;

        this.selectVariable(variable, set); */
    }

    toggleSet(variableSet: VariableSet) {
        variableSet.opened = !variableSet.opened;
    }

    toggleDatagroup(dataSet: VariableSet) {
        dataSet.opened = !dataSet.opened;
    }

    selectVariable(variable: VariableItem, set: VariableSet) {
        this.setVariableId(variable.id);
        this.setDatasetId(variable.datasetId!);

        this.updateRoute();
    }

    selectDataset(dataset: VariableItem, datagroup: VariableSet) {
        this.currentDatagroup = datagroup.id;
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
.dataset-button {
    font-size: 0.5em;
    float: right;
    cursor: pointer;
    padding: none;
    background: none;
    border: none;

    i {
        font-size: 1.1rem;
    }
    svg {
        margin-left: 0.5rem;
    }
}

.rotate svg {
    transform: rotate(180deg);
}

a {
    cursor: pointer !important;
}

.fa-chevron-down {
    position: absolute;
    right: 10%;
}

.datasets {
    left: 91%;
    position: absolute;
    z-index: 10;
    top: 0;
    width: 85%;

    h3 {
        background-color: #f9f9f9;
        border-left: 2px solid black !important;
    }

    .menu {
        border-left: 2px solid black;
    }

    ul {
        margin-left: 0 !important;
    }
}

.dataset-list li a {
    padding-left: 4rem !important;
}

.list-group.header {
    padding-right: 0 !important;
}
</style>
