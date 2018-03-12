<template>

    <b-dropdown :text="$t(`${tPath}.title`, { current: $t(`${tPath}.${currentId}.shortName`) })" variant="light" class="cip-selector">

        <div class="cip-dropdown-info">
            <h6 class="dropdown-header">{{ $t(`${tPath}.header`) }}</h6>
            <div class="cip-dropdown-description">{{ $t(`${tPath}.description`) }}</div>
        </div>

        <b-dropdown-divider></b-dropdown-divider>

        <div class="cip-dropdown-content">
            <template v-for="(group, index) in filteredGroups">
                <b-dropdown-divider :key="`divider-${ group.id }`" v-if="index !== 0"></b-dropdown-divider>

                <div role="group" :aria-lableledby="group.id" :key="`group-${ group.id }`">
                    <b-dropdown-header :id="group.id" v-if="isHeaderVisible(group)">{{ $t(`${tPath}.${group.id}`) }}</b-dropdown-header>

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
import { State, Getter, Action } from 'vuex-class';

import api from './../../api/main';

import { rcpSelectorConfig, BaseSelectorConfig, BaseSelectorGroupConfig } from './../../configs';

@Component
export default class BaseSelectorV extends Vue {
    @Emit()
    select(value: string) {}

    @Prop() config: BaseSelectorConfig;
    @Prop({ default: undefined })
    available: string[];
    @Prop() currentId: string;

    @Prop() tPath: string;

    /**
     * Returns a filtered set of selector groups.
     * Each group's items are filtered against the available items passed to the selector. Only groups with more than one item after filtering will be included in the selector.
     */
    get filteredGroups(): BaseSelectorGroupConfig[] {
        const result = this.config.groups.reduce((map: BaseSelectorGroupConfig[], group) => {
            const filteredItems = this.available
                ? group.items.filter(item => this.available.includes(item))
                : group.items;

            if (filteredItems.length === 0) {
                return map;
            }

            const filteredGroup: BaseSelectorGroupConfig = {
                id: group.id,
                showHeader: group.showHeader,
                items: filteredItems
            };
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

.cip-selector {
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

    .cip-qualifier {
        font-size: 0.7em;
        font-weight: 100;
    }

    &.cip-horizontal {
        .cip-dropdown-content {
            display: flex;
        }
    }

    .dropdown-divider {
        border-right: 1px solid #e9ecef;
        height: auto;
        margin: 0.5rem;
    }
}
</style>
