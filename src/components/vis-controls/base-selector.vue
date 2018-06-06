<template>

    <b-dropdown variant="light" class="cip-selector">

        <template slot="button-content">
            <div class="cip-content-wrap">
                <span class="cip-value-label">{{ $t(`${tPath}.title`) }}</span>
                <span class="cip-selected-value">{{ $t(`${tPath}.${currentId}.shortName`) }}</span>
            </div>
        </template>

        <div class="cip-dropdown-info">
            <span class="dropdown-header">{{ $t(`${tPath}.header`) }}</span>
            <div class="cip-dropdown-description">{{ $t(`${tPath}.description`) }}</div>
        </div>

        <b-dropdown-divider></b-dropdown-divider>

        <div class="cip-dropdown-content">
            <template v-for="(group, index) in filteredGroups">
                <b-dropdown-divider :key="`divider-${ group.id }`" v-if="index !== 0"></b-dropdown-divider>

                <div role="group" :aria-lableledby="group.id" :key="`group-${ group.id }`">
                    <b-dropdown-header :id="group.id" v-if="group.showHeader">{{ $t(`${tPath}.${group.id}`) }}</b-dropdown-header>

                    <b-dropdown-item-button
                        :aria-describedby="group.id"
                        v-for="item in group.items"
                        :disabled="item === currentId"
                        :class="{ 'cip-selected': item === currentId }"
                        @click="select(item)"
                        :key="`item-${ item }`">
                            <span class="cip-name">{{ $t(`${tPath}.${item}.fullName`) }}</span>
                            <span class="cip-qualifier">{{ $t(`${tPath}.${item}.qualifier`) }} </span>
                    </b-dropdown-item-button>
                </div>

            </template>
        </div>

    </b-dropdown>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject, Emit } from 'vue-property-decorator';

import { rcpSelectorConfig, BaseSelectorConfig, BaseSelectorGroupConfig } from './../../configs/selectors';

@Component
export default class BaseSelectorV extends Vue {
    @Emit()
    select(value: string) {}

    @Prop() config: BaseSelectorConfig;
    @Prop({ default: undefined })
    available: string[]; // an array of item ids/names which can be rendered in this selector; all other value will not be shown
    @Prop() currentId: string;

    @Prop() tPath: string;

    /* create() {
        console.log('----', this.config, this.currentId);
    } */

    /**
     * Returns a filtered set of selector groups.
     * Each group's items are filtered against the available items passed to the selector. Only groups with more than one item after filtering will be included in the selector.
     */
    get filteredGroups(): BaseSelectorGroupConfig[] {
        const result = this.config.groups.reduce((map: BaseSelectorGroupConfig[], group) => {
            const filteredItems = this.available
                ? group.items.filter(item => this.available.includes(item))
                : group.items;

            // filter out groups with not items in them
            if (filteredItems.length === 0) {
                return map;
            }

            const filteredGroup: BaseSelectorGroupConfig = {
                id: group.id,
                items: filteredItems,
                showHeader: group.showHeader
            };
            filteredGroup.showHeader = this.isHeaderVisible(filteredGroup);

            map.push(filteredGroup);

            return map;
        }, []);

        return result;
    }

    /**
     * Specifies if the group header should be shown or not.
     */
    isHeaderVisible(group: BaseSelectorGroupConfig): boolean {
        if (group.showHeader === undefined) {
            return group.items.length > 1;
        } else {
            return group.showHeader;
        }
    }
}
</script>

<style lang="scss" scoped>
@import './../../styles/variables.scss';
@import './../../styles/view-controls.scss';
</style>
