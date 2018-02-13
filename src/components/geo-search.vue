<template>
    <div class="cip-geo-search">

        <div class="cip-input">
            <i class="fas fa-map-marker-alt fa-lg"></i>
            <input
                type="text"
                class="form-control"
                v-model="query"
                @focus="isVisible = true"
                placeholder="enter location" />
            <i class="fas fa-search"></i>
        </div>

        <div class="cip-results" v-if="isVisible && hasResults">
            <button class="cip-result"
                v-for="(result, index) in queryResults.slice(0, 10)"
                :key="index"
                @click="zoomToResult(result)">
                <span class="cip-name">{{ result.name }},<span class="cip-details"> {{ result.location | truncate }}, {{abbreviations[result.province]}}</span></span><span class="cip-type">{{ result.type | truncate }}</span>
            </button>
        </div>

        <div class="cip-results" v-if="isVisible && hasNoResults">
            <span class="cip-result">no matches found for "{{ query }}"</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

Vue.filter('truncate', (str:string) => {
    if (str && str.length > 15) {
        return str.substring(0,15) + '...';
    }
    return str;
});

@Component
export default class GeoSearch extends Vue {
    @Getter getQuery: Dictionary<string>;

    @Action setCenterPoint: (value: { x: number; y: number }) => void;
    @Action setZoomLevel: (value: number) => void;

    query: string = '';

    abbreviations = {
        'Alberta' : 'AB',
        'British Columbia': 'BC',
        'Manitoba': 'MB',
        'New Brunswick': 'NB',
        'Newfoundland and Labrador': 'NL',
        'Nova Scotia': 'NS',
        'Ontario': 'ON',
        'Prince Edward Island': 'PE',
        'Quebec': 'QC',
        'Saskatchewan': 'SK',
        'Yukon': 'YT',
        'Nunavut': 'NU',
        'Northwest Territories': 'NT'
    }

    @Watch('query')
    onQueryChanged(): void {
        if (this.query.length === 0) {
            this.queryResults = [];
        }

        if (this.query.length < 3) {
            return;
        }

        this.queryStream.next(this.query);
    }

    queryStream: Subject<string> = new Subject<string>();
    queryResults: any[] = [];

    isVisible: boolean = false;

    get hasResults(): boolean {
        return this.queryResults.length > 0 && this.query.length > 3;
    }

    get hasNoResults(): boolean {
        return this.queryResults.length === 0 && this.query.length > 3;
    }

    /*gConfig: any = {
        language: 'en',
        types: {
            CITY: {
                fr: {
                    term: 'Ville',
                    description:
                        "La principale division administrative du Canada. Il s'agit d'un territoire juridiquement défini, établi par des articles de la Confédération ou par des amendements constitutionnels."
                }
            }
        }
    }; */
    gSearch: any = new (<any>window).GeoSearch(null);

    mounted(): void {
        this.queryStream.debounceTime(200).subscribe(this.getResults);

        // clickout
        if (typeof document !== 'undefined') {
            document.documentElement.addEventListener(
                'click',
                this.clickOutListener
            );
        }
    }

    async getResults(query: string) {
        try {
            this.queryResults = await this.gSearch.query(query + '*');
            // console.log('q results', this.queryResults);
        } catch (event) {
            console.log(event);
        }
    }

    zoomToResult(result: any): void {
        console.log(result.geometry);
        this.setCenterPoint({
            x: result.pointCoords[0],
            y: result.pointCoords[1]
        });

        this.setZoomLevel(8);

        this.updateRoute();
    }

    clickOutListener(e: MouseEvent): void {
        if (!this.$el.contains(e.target as HTMLElement)) {
            if (this.clickOutListener) {
                this.isVisible = false;
            }
        }
    }

    updateRoute(): void {
        this.$router.push({
            name: this.$router.currentRoute.name,
            query: this.getQuery
        });
    }

    beforeDestroy() {
        // clickout
        if (typeof document !== 'undefined') {
            document.documentElement.removeEventListener(
                'click',
                this.clickOutListener
            );
        }
    }

    // TODO: steal/create clickOut mixin instead of adding all the listeners manually
}
</script>


<style lang="scss" scoped>
@import './../styles/variables.scss';

.cip-geo-search {
    width: 40rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.cip-input {
    // width: 25%; // margin-left: 1rem;
    position: relative;
    // display: flex;
    // align-items: center;
    flex: 1;

    input {
        // hide the default styles
        border: none;
        box-shadow: none;
        background-color: transparent;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 0;
        margin-right: 3rem;
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

.cip-results {
    position: absolute;
    width: 100%;
    z-index: 1000;
    left: 0;
    top: $top-navigation-height;

    padding: 0.5em 0;
    margin: 0.125em 0 0;
    font-size: 1em;
    color: #212529;
    text-align: left;
    list-style: none;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    box-shadow: none;
}

.cip-result {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.25em 1.5em;
    clear: both;
    font-weight: 400;
    color: #212529;
    text-align: inherit;
    white-space: nowrap;
    background: none;
    border: 0;

    .cip-name {
        flex: 1;
    }
    .cip-details {
        font-size: 0.7em;
        color: grey;
    }

    .cip-type {
        font-size: 0.8em;
        font-weight: 100;
    }
}
</style>
