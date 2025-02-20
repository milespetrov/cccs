<template>
    <component :is='bodyOnly ? "selector-body" : "base-selector"'
        :available="available"
        :config="config"
        :currentId="datasetId"
        tPath="datasetSelector"
        itemTPath="datasetSelector"
        @select="select"/>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';
import { mixins } from 'vue-class-component';

import BaseSelectorV from './base-selector.vue';
import SelectorBodyV from './selector-body.vue';
import { UpdateRouteMixin } from './../../globals/mixin';

import { DatasetFilter, DatasetId } from '@/types';
import { datasetSelectorConfig, DatasetSelectorConfig } from './../../configs/selectors';
import { datasets } from '@/configs/datasets';

const StateApp = namespace('app', State);
const GetterApp = namespace('app', Getter);
const ActionApp = namespace('app', Action);

@Component({
    components: {
        'base-selector': BaseSelectorV,
        'selector-body': SelectorBodyV
    }
})
export default class DatasetSelector extends mixins(UpdateRouteMixin) {
    @ActionApp setDatasetId: (value: string) => void;
    @StateApp variableId: string;
    @StateApp datasetId: string;
    @StateApp datasetFilter: DatasetFilter | null;

    @Prop()
    bodyOnly: boolean;

    config: DatasetSelectorConfig = datasetSelectorConfig;

    get available() {
        if (this.datasetFilter) {
            let filtered: DatasetId[] = [];
            this.config.groups.forEach(group => {
                filtered = filtered.concat(
                        group.items.filter(datasetId => {
                            return datasets[datasetId].filters.includes(this.datasetFilter)
                        })
                    );
            });

            return filtered;
        }

        return undefined;
    }

    select(value: DatasetId) {
        this.setDatasetId(value);
        this.updateRoute();
    }
}
</script>

<style lang="scss" scoped>
@import './../../styles/variables.scss';
@import './../../styles/view-controls.scss';

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
