<template>
    <main role="main" property="mainContentOfPage" class="container" id="app">

        <h1 property="name" id="wb-cont">Content page</h1>
        
        <select v-model="selectedTimePeriod">
            <option v-for="timePeriod in timePeriods" :key="timePeriod">{{ timePeriod }}</option>
        </select>
        
        <section>
            <component :is="currentView" :selectedTimePeriod="selectedTimePeriod"></component>
        </section>
    </main>
</template>


<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';

import ChartView from './components/chart-view.vue';

@Component({
    components: {
        'chart-view': ChartView
    }
})
export default class App extends Vue {
    currentView: string = 'chart-view';

    timePeriods: string[] = [
        'Jan_Janv',
        'Feb_Fev',
        'Mar_March',
        'Apr_Avr',
        'May_Mai',
        'June_Juin',
        'July_Juil',
        'Aug_Aout',
        'Sept_Sept',
        'Oct_Oct',
        'Nov_Nov',
        'Dec_Dec',
        'Annual_Annuel',
        'Winter_Hiver',
        'Spring_Printemp',
        'Summer_Ete',
        'Autumn_Autome'
    ];
    selectedTimePeriod = this.timePeriods[0];
}
</script>

<style lang="scss" scoped>

</style>
