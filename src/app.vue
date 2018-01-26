<template>
    <main role="main" property="mainContentOfPage" id="wb-cont" class="cip-scope">

        <router-view name="location-map"></router-view>

        <nav class="top-level-menu container">
            <h2 class="title">
                <i class="fas fa-globe fa-lg"></i>
                <span>Canadian Climate Portal Services</span>
            </h2>

            <span class="separator"></span>

            <span class="menu-option">
                <span>Climate Basics</span>
                <i class="fas fa-chevron-down"></i>
            </span>

            <span class="menu-option">
                <span>Data</span>
                <i class="fas fa-chevron-down"></i>
            </span>

            <span class="menu-option">
                <span>Catalogue</span>
                <i class="fas fa-chevron-down"></i>
            </span>

        </nav>

        <nav class="location-search container">

            <div class="search-box">
                <i class="fas fa-map-marker-alt fa-lg"></i>
                <input type="text" class="form-control" placeholder="enter location" />
                <i class="fas fa-search"></i>
            </div>
        </nav>

        <section class="container main">
            <div class="row">
                <section class="content col-md-9 col-md-push-3">
                    <keep-alive>
                        <router-view class="visualization-menu" name="visualization-menu"></router-view>
                    </keep-alive>

                    <keep-alive>
                        <router-view class="visualization" name="visualization"></router-view>
                    </keep-alive>

                </section>

                <variable-selector class="variable-selector"></variable-selector>
            </div>

        </section>
    </main>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';

import Dropdown from 'bootstrap-vue/es/components/dropdown';
import FormSelect from 'bootstrap-vue/es/components/form-select';
Vue.use(Dropdown);
Vue.use(FormSelect);

import VariableSelector from './components/variable-selector.vue';

import {
    cTimePeriodId,
    cVariableId,
    cDatasetId,
    rGetQuery
} from './store/modules/app';

@Component({
    components: {
        'variable-selector': VariableSelector
    }
})
export default class App extends Vue {
    mounted(): void {
        if (this.$router.currentRoute.name) {
            // the route is set already

            cTimePeriodId(this.$store, this.$router.currentRoute.query.t);
            cVariableId(this.$store, this.$router.currentRoute.query.v);
            cDatasetId(this.$store, this.$router.currentRoute.query.d);
            return;
        }

        cTimePeriodId(this.$store, 'Jan_Janv');
        cVariableId(this.$store, 'max-temp');
        cDatasetId(this.$store, 'ahccd');

        // DEMO: push to the chart view on mount by default, so something will show up
        this.$router.push({
            name: 'chart-view',
            query: rGetQuery(this.$store)
        });
    }
}
</script>

<style lang="scss">
// global changes on top of bootstrap default stylings
@import './styles/vendor.scss';
</style>

<style lang="scss" scoped>
// TODO: remove demo hack
// this just adds a fake map image in the header for the chart-view
/deep/ .fake-location-search-map {
    position: absolute;
    background-image: url(https://i.imgur.com/BdnP4yF.png);
    top: 0;
    left: 0;
    right: 0;
    height: 175px;
}

.top-level-menu {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.7);
    position: relative;

    .title {
        margin: 0 0 0 1rem;
        padding: 0;
        display: flex;
        align-items: center;

        > svg {
            margin-right: 1rem;
        }

        > span {
            font-size: 2rem;
        }
    }

    .menu-option {
        margin: 0 2rem;
        font-weight: bold;

        > svg {
            margin: auto;
        }
    }

    .separator {
        flex: 1;
    }
}

.location-search {
    display: flex;
    align-items: center;
    height: 120px;

    .search-box {
        width: 30%;
        margin-left: 1rem;
        position: relative;
        display: flex;
        align-items: center;

        input {
            padding: 0 3rem 0 3.5rem;
            width: 100%;
        }

        > .fa-map-marker-alt {
            color: grey;
            position: absolute;
            left: 1rem;
            height: 37px;
            top: 0;
        }

        > .fa-search {
            position: absolute;
            right: 1rem;
            height: 37px;
            top: 0;
        }
    }
}
</style>
