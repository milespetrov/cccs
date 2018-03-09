<template>
    <b-dropdown :text="$t(`${tPath}.title`, { current: $t(`${tPath}.${variableId}.shortName`) })" variant="light" class="cip-variable-selector">

        <div class="cip-dropdown-info">
            <h6 class="dropdown-header">{{ $t(`${tPath}.header`) }}</h6>
            <div class="cip-dropdown-description">{{ $t(`${tPath}.description`) }}</div>
        </div>

        <b-dropdown-divider></b-dropdown-divider>

        <template v-for="(variableGroup, index) in config.groups">
            <b-dropdown-divider :key="`divider-${ variableGroup.id }`" v-if="index !== 0"></b-dropdown-divider>

            <div role="group" :aria-lableledby="variableGroup.id" :key="`group-${ variableGroup.id }`">
                <b-dropdown-header :id="variableGroup.id" v-if="variableGroup.items.length > 1">{{ $t(`${tPath}.${variableGroup.id}`) }}</b-dropdown-header>

                <div class="cip-dropdown-multi-item" v-for="variableItem in variableGroup.items" :key="`item-${ variableItem }`">
                    <span>{{ $t(`${tPath}.${variableItem}.fullName`) }}</span>

                    <div class="cip-dropdown-multi-item-options">

                        <!-- <div v-for="option in options[variableItem]" :key="option">{{ option }}</div> -->

                        <b-dropdown-item-button
                            :aria-describedby="variableGroup.id"
                            v-if="futureStage.length > 0"
                            :disabled="variableItem === variableId && futureStage.includes(datasetId)"
                            :class="{ 'cip-selected': variableItem === variableId && futureStage.includes(datasetId) }"
                            @click="selectVariable(variableItem, option)">button!</b-dropdown-item-button>

                        <b-dropdown-item-button
                            :aria-describedby="variableGroup.id"
                            v-for="(option, $index) in options[variableItem]" :key="`option-${ $index }`"
                            v-if="option.length > 0"
                            :disabled="variableItem === variableId"
                            :class="{ 'cip-selected': variableItem === variableId }"
                            @click="selectVariable(variableItem, option)">button!</b-dropdown-item-button>
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
import { variableSelectorConfig, VariableSelectorConfig, datasets, DatasetId, VariableStageType } from '../../configs';

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

    tPath: string = 'variableSelector';
    config: VariableSelectorConfig = variableSelectorConfig;

    @Action setVariableId: (value: string) => void;
    @Action setDatasetId: (value: string) => void;

    @State variableId: string;
    @State datasetId: DatasetId;

    get futureStage() {
        return this.options[VariableStageType.Future];
    }

    options: any = {};

    created() {
        // this.a = Object.values(DatasetId).reduce((map: any, id: DatasetId) => {
        this.options = [DatasetId.AHCCD].reduce((map: any, id: DatasetId) => {
            // const dataset = datasets[id];
            datasets[id].variables.forEach(variable => {
                if (!map[variable.id]) {
                    map[variable.id] = {
                        [VariableStageType.Future]: [],
                        [VariableStageType.Historic]: []
                    };
                }

                map[variable.id][variable.stage].push(id);
            });

            return map;
        }, {});

        console.log('a', this.options);
    }

    get selectedVariableName(): string {
        const variables = this.variableGroups.reduce<VariableItem[]>((array, group) => array.concat(group.items), []);

        return `Variable: ${variables.find(variable => variable.id === this.variableId)!.name}`;
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
