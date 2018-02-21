<template>
    <b-dropdown :text="selectedVariableName" variant="light" class="cip-variable-selector">
        
        <div class="cip-dropdown-info">
            <h6 class="dropdown-header">Climate Data</h6>
            <div class="cip-dropdown-description">An essential climate variable (ECV) is a physical, chemical or biological variable or a group of linked variables that critically contributes to the characterization of Earth’ s climate.</div>
        </div>
        
        <b-dropdown-divider></b-dropdown-divider>

        <template v-for="(variableGroup, index) in variableGroups">
            <b-dropdown-divider :key="`divider-${ variableGroup.id }`" v-if="index !== 0"></b-dropdown-divider>
            
            <div role="group" :aria-lableledby="variableGroup.id" :key="`group-${ variableGroup.id }`">
                <b-dropdown-header :id="variableGroup.id" v-if="variableGroup.items.length > 1">{{ variableGroup.name }}</b-dropdown-header>
                
                <div class="cip-dropdown-multi-item" v-for="variableItem in variableGroup.items" :key="`item-${ variableItem.id }`">
                    <span>{{ variableItem.name }}</span>

                    <div class="cip-dropdown-multi-item-options">
                        <!-- :class="{'cip-selected': variableItem.id === variableId && option.id === datasetId }" -->
                        <b-dropdown-item-button 
                            :aria-describedby="variableGroup.id"
                            :disabled="variableItem.id === variableId && option.datasetId === datasetId"
                            :class="{ 'cip-selected': variableItem.id === variableId && option.datasetId === datasetId }"
                            @click="selectVariable(variableItem, option)"
                            v-for="option in variableItem.options" :key="`option-${ option.datasetId }`">{{ option.name }}</b-dropdown-item-button>
                    </div>
                </div>
            </div>

        </template>

    </b-dropdown>
    
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { mixins } from 'vue-class-component';

import api from './../../api/main';
import { Dictionary } from 'vue-router/types/router';
import { UpdateRouteMixin } from './../../globals/mixin';

interface VariableGroup {
    name: string;
    id: string;
    items: VariableItem[];
}

interface VariableItem {
    name: string;
    id: string;
    options: VariableOption[];
}

interface VariableOption {
    name: string;
    datasetId: string;
    // datasetOptions: string[];
}

@Component
export default class VariableSelector extends mixins(UpdateRouteMixin) {
    variableGroups: VariableGroup[] = [
        {
            name: 'Temperature',
            id: 'temp-group',
            items: [
                {
                    name: 'Mean Temperature',
                    id: 'tmean',
                    options: [
                        {
                            name: 'Historic',
                            datasetId: 'ahccd'
                        },
                        {
                            name: 'Future',
                            datasetId: 'cmip5'
                        }
                    ]
                },
                {
                    name: 'Minimum Temperature',
                    id: 'tmin',
                    options: [
                        {
                            name: 'Historic',
                            datasetId: 'ahccd'
                        },
                        {
                            name: 'Future',
                            datasetId: 'cmip5'
                        }
                    ]
                },
                {
                    name: 'Maximum Temperature',
                    id: 'tmax',
                    options: [
                        {
                            name: 'Historic',
                            datasetId: 'ahccd'
                        },
                        {
                            name: 'Future',
                            datasetId: 'cmip5'
                        }
                    ]
                }
            ]
        },
        {
            name: 'Wind Speed',
            id: 'wind-speed-group',
            items: [
                {
                    name: 'Surface Wind Speed',
                    id: 'surface-wind-speed',
                    options: [
                        {
                            name: 'Future',
                            datasetId: 'cmip5'
                        }
                    ]
                }
            ]
        },
        {
            name: 'Precipitation',
            id: 'precip-group',
            items: [
                {
                    name: 'Precipitation',
                    id: 'precip',
                    options: [
                        {
                            name: 'Historic',
                            datasetId: 'ahccd'
                        },
                        {
                            name: 'Future',
                            datasetId: 'cmip5'
                        }
                    ]
                }
            ]
        },
        {
            name: 'Ice',
            id: 'ice-group',
            items: [
                {
                    name: 'Sea Ice Thickness',
                    id: 'ice-thickness',
                    options: [
                        {
                            name: 'Future',
                            datasetId: 'cmip5'
                        }
                    ]
                },
                {
                    name: 'Sea Ice Fraction',
                    id: 'ice-fraction',
                    options: [
                        {
                            name: 'Future',
                            datasetId: 'cmip5'
                        }
                    ]
                }
            ]
        },
        {
            name: 'Snow Depth',
            id: 'snow-group',
            items: [
                {
                    name: 'Snow Depth',
                    id: 'snow-depth',
                    options: [
                        {
                            name: 'Future',
                            datasetId: 'cmip5'
                        }
                    ]
                }
            ]
        }
    ];

    @Action setVariableId: (value: string) => void;
    @Action setDatasetId: (value: string) => void;

    @State variableId: string;
    @State datasetId: string;
    @State currentView: string;

    @Getter getQuery: Dictionary<string>;

    get selectedVariableName(): string {
        const variables = this.variableGroups.reduce<VariableItem[]>(
            (array, group) => array.concat(group.items),
            []
        );

        return `Variable: ${
            variables.find(variable => variable.id === this.variableId)!.name
        }`;
    }

    selectVariable(variable: VariableItem, option: VariableOption) {
        this.setVariableId(variable.id);
        this.setDatasetId(option.datasetId);

        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
@import './../../styles/variables.scss';
@import './../../styles/view-controls.scss';

.b-dropdown .cip-dropdown-multi-item-options {
    width: 16em !important;
}
</style>
