<template>

    <b-dropdown :text="$t(`${tPath}.title`, { current: $t(`${tPath}.${currentId}.shortName`) })" variant="light" class="cip-selector">

        <div class="cip-dropdown-info">
            <h6 class="dropdown-header">{{ $t(`${tPath}.header`) }}</h6>
            <div class="cip-dropdown-description">{{ $t(`${tPath}.description`) }}</div>
        </div>

        <b-dropdown-divider></b-dropdown-divider>

        <div class="cip-dropdown-horizontal">
            <template v-for="(group, index) in config.groups">
                <b-dropdown-divider :key="`divider-${ group.id }`" v-if="index !== 0"></b-dropdown-divider>

                <div role="group" :aria-lableledby="group.id" :key="`group-${ group.id }`">
                    <b-dropdown-header :id="group.id" v-if="group.items.length > 0 && group.showHeader">{{ $t(`${tPath}.${group.id}`) }}</b-dropdown-header>

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
import { Dictionary } from 'vue-router/types/router';

import { rcpSelectorConfig, BaseSelectorConfig } from './../../configs';

@Component
export default class BaseSelectorV extends Vue {
    @Emit()
    select(value: string) {}

    @Prop() config: BaseSelectorConfig;
    @Prop() currentId: string;

    @Prop() tPath: string;
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
}
</style>
