<template>
    <!-- Everything b-dropdown-* is from Bootstrap Vue. You will never find it with sane search. -->
    <b-dropdown ref="dropdown" variant="light" class="cip-selector" :disabled="hasSingleOption()" no-flip>

        <template slot="button-content">
            <div class="cip-content-wrap">
                <span class="cip-value-label">{{ $t(`${tPath}.title`) }}</span>
                <span class="cip-selected-value">{{ $t(`${itemTPath}.${currentId}.shortName`) }}</span>
            </div>
        </template>

        <selector-body 
            :available="available"
            :config="config"
            :currentId="currentId"
            :tPath="tPath"
            :itemTPath="itemTPath"
            @select="passSelect" />
    </b-dropdown>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

import { BaseSelectorConfig, BaseSelectorGroupConfig } from './../../configs/selectors';
import SelectorBodyV from './selector-body.vue';

@Component({
    components: {
        'selector-body': SelectorBodyV
    }
})
export default class BaseSelectorV extends Vue {
    @Emit()
    select(value: string) { }

    @Prop()
    config: BaseSelectorConfig;
    @Prop({ default: undefined })
    available: string[]; // an array of item ids/names which can be rendered in this selector; all other value will not be shown
    @Prop()
    currentId: string;

    @Prop()
    tPath: string;
    @Prop()
    itemTPath: string; // the translation path for the subitems in the selector (variable names, dataset names, etc.) Needed to allow different var names per dataset

    passSelect(value: string) {
        this.select(value);

        // force close the dropdown on selection (this is on mobile only)
        (this.$refs['dropdown'] as any).hide();
    }

    /**
     * Returns a filtered set of selector groups.
     * Each group's items are filtered against the available items passed to the selector. Only groups with more than one item after filtering will be included in the selector.
     */
    get filteredGroups(): BaseSelectorGroupConfig[] {
        const result = this.config.groups.reduce((map: BaseSelectorGroupConfig[], group) => {
            const filteredItems = this.available
                ? group.items.filter(item => this.available.includes(item))
                : group.items;

            // filter out groups with no items in them
            if (filteredItems.length === 0) {
                return map;
            }

            const filteredGroup: BaseSelectorGroupConfig = {
                id: group.id,
                items: filteredItems,
                showHeader: group.showHeader
            };

            map.push(filteredGroup);

            return map;
        }, []);

        return result;
    }

    hasSingleOption(): boolean {
        return this.filteredGroups.reduce((map: string[], group) => map.concat(group.items), []).length === 1;
    }

    hasTranslation(key: string): boolean {
        return this.$i18n.t(key) !== key;
    }
}
</script>

<style lang="scss" scoped>
@import './../../styles/variables.scss';
@import './../../styles/view-controls.scss';
</style>
