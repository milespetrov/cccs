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
                <div v-for="(set, index) in Object.keys(sets)" :key="`${index}-set`">
                    <li @click="toggleSet(set)">
                        <a role="button" href="javascript:" class="list-group-item" :class="{ 'wb-navcurr': selectedSet == set, 'rotate': sets[set].opened}">{{ set }} <i class="fas fa-chevron-down"></i></a>
                    </li>
                    <ul class="list-group list-unstyled" v-show="sets[set].opened">
                        <li v-for="(variable, index) in sets[set].variables" :key="`${index}-variable`" @click="selectVariable(variable, set)">
                            <a role="button" href="javascript:" class="list-group-item" :class="{ 'wb-navcurr': currentVariable == variable}" >{{ variable }}</a>
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
                <div v-for="(group, index) in Object.keys(datagroups)" :key="`${index}-group`">
                    <li @click="toggleDatagroup(group)">
                        <a role="button" href="javascript:" class="list-group-item" :class="{ 'wb-navcurr': currentDatagroup == group, 'rotate': datagroups[group].opened}">{{ group }} <i class="fas fa-chevron-down"></i></a>
                    </li>
                    <ul class="list-group list-unstyled dataset-list" v-show="datagroups[group].opened">
                        <li v-for="(dataset, index) in datagroups[group].variables" :key="`${index}-dataset`" @click="selectDataset(dataset, group)">
                            <a role="button" href="javascript:" class="list-group-item" :class="{ 'wb-navcurr': currentDataset == dataset}" >{{ dataset }}</a>
                        </li>
                    </ul>
                </div>
            </ul>
        </section>
    </nav>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

import api from './../api/main';
import {rGetCurrentVariable, cSetCurrentVariable, rGetCurrentDataset, cSetCurrentDataset} from './../store/modules/app'

interface setSet {
    [key: string]: varSet;
}

interface varSet {
    variables: string[];
    opened: boolean;
}

@Component
export default class VariableSelector extends Vue {
    sets: setSet = {
        Historic: {
            variables: [
                "Average Temperature",
                "Minimum Temperature",
                "Maximum Temperature",
                "Precipitation"
            ],
            opened: false
        },
        Projected: {
            variables: [
                "var1",
                "var2",
                "var3"
            ],
            opened: false
        }
    };

    datagroups: setSet = {
        "AHCCD": {
            variables: [
                "AHCCD 1",
                "AHCCD 2"
            ],
            opened: false
        },
        "SET 2": {
            variables: [
                "dataset 1",
                "dataset 5"
            ],
            opened: false
        },
        "SET 3": {
            variables: [
                "dataset 2",
                "dataset 3"
            ],
            opened: false
        }
    };

    selectedSet:string = "";
    datasetSelectorOpen:boolean = false;
    currentDatagroup:string = "";

    toggleSet(set:string) {
        this.selectedSet = ((this.sets[set].opened || rGetCurrentVariable(this.$store) !== "") ? this.selectedSet : set);
        this.sets[set].opened = !this.sets[set].opened;
    }

    toggleDatagroup(datagroup:string) {
        this.currentDatagroup = ((this.datagroups[datagroup].opened || rGetCurrentDataset(this.$store) !== "") ? this.currentDatagroup : datagroup);
        this.datagroups[datagroup].opened = !this.datagroups[datagroup].opened;
    }

    selectVariable(variable:string, set:string) {
        this.selectedSet = set;
        cSetCurrentVariable(this.$store, variable);
    }

    selectDataset(dataset:string, datagroup:string) {
        this.currentDatagroup = datagroup;
        cSetCurrentDataset(this.$store, dataset);
    }

    get currentVariable(): string {
        return rGetCurrentVariable(this.$store);
    }

    get currentDataset(): string {
        return rGetCurrentDataset(this.$store);
    }
}
</script>

<style lang="scss" scoped>

.dataset-button {
    font-size: 0.5em;
    float: right;
    cursor: pointer;
    padding: none;
    background:none;
    border:none;

    i {
        font-size: 1.1rem;
    }
    svg {
        margin-left:0.5rem;
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


