<template>
    <b-dropdown :text="selectedTimePeriodName" variant="light" class="cip-time-period-selector">
        
        <template v-for="(timePeriodGroup, index) in timePeriodGroups">
            <b-dropdown-divider :key="`divider-${ timePeriodGroup.id }`" v-if="index !== 0"></b-dropdown-divider>
            
            <div role="group" :aria-lableledby="timePeriodGroup.id" :key="`group-${ timePeriodGroup.id }`">
                <b-dropdown-header :id="timePeriodGroup.id" v-if="timePeriodGroup.items.length > 1">{{ timePeriodGroup.name }}</b-dropdown-header>
                
                <b-dropdown-item-button
                    :aria-describedby="timePeriodGroup.id" 
                    @click="selectTimePeriod(timePeriod)"
                    v-for="timePeriod in timePeriodGroup.items" :key="`time-period-${ timePeriod.id }`">
                        <span class="cip-name">{{ timePeriod.name }}</span><span class="cip-description">{{ timePeriod.description }} </span>
                    </b-dropdown-item-button>
            </div>

        </template>

    </b-dropdown>
    
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

import api from './../api/main';
import { Dictionary } from 'vue-router/types/router';

interface TimePeriodGroup {
    name: string;
    id: string;
    items: TimePeriodItem[];
}

interface TimePeriodItem {
    name: string;
    id: string;
    description?: string;
}

@Component
export default class TimePeriodSelector extends Vue {
    timePeriodGroups: TimePeriodGroup[] = [
        {
            name: 'Monthly',
            id: 'monthly-group',
            items: [
                { name: 'January', id: 'Jan_Janv' },
                { name: 'February', id: 'Feb_Fev' },
                { name: 'March', id: 'Mar_March' },
                { name: 'April', id: 'Apr_Avr' },
                { name: 'May', id: 'May_Mai' },
                { name: 'June', id: 'June_Juin' },
                { name: 'July', id: 'July_Juil' },
                { name: 'August', id: 'Aug_Aout' },
                { name: 'September', id: 'Sept_Sept' },
                { name: 'October', id: 'Oct_Oct' },
                { name: 'November', id: 'Nov_Nov' },
                { name: 'December', id: 'Dec_Dec' }
            ]
        },
        {
            name: 'Seasonal',
            id: 'season-group',
            items: [
                {
                    name: 'Winter',
                    id: 'Winter_Hiver',
                    description: 'Dec - Feb'
                },
                {
                    name: 'Spring',
                    id: 'Spring_Printemp',
                    description: 'Mar - May'
                },
                {
                    name: 'Summer',
                    id: 'Summer_Ete',
                    description: 'Jun - Aug'
                },
                {
                    name: 'Autumn',
                    id: 'Autumn_Autome',
                    description: 'Sep - Nov'
                }
            ]
        },
        {
            name: 'Annual',
            id: 'annual-group',
            items: [{ name: 'Annual', id: 'Annual_Annuel' }]
        }
    ];

    @Action setTimePeriodId: (value: string) => void;

    @State timePeriodId: string;

    @Getter getQuery: Dictionary<string>;

    get selectedTimePeriodName(): string {
        const timePeriods = this.timePeriodGroups.reduce<TimePeriodItem[]>(
            (array, group) => array.concat(group.items),
            []
        );

        return timePeriods.find(
            timePeriod => timePeriod.id === this.timePeriodId
        )!.name;
    }

    selectTimePeriod(timePeriod: TimePeriodItem) {
        this.setTimePeriodId(timePeriod.id);

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

.cip-time-period-selector {
    .dropdown-item {
        display: flex;
        align-items: center;
    }

    .cip-name {
        flex: 1;
        margin-right: 3rem;
    }

    .cip-description {
        font-size: 0.7em;
        font-weight: 100;
    }
}
</style>
