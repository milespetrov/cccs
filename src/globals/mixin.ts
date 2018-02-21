import { Vue, Watch, Component, Prop, Inject } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';

@Component
export class UpdateRouteMixin extends Vue {
    @Getter getQuery: Dictionary<string>;

    @State currentView: string;

    updateRoute(): void {
        this.$router.push({
            name: this.currentView,
            query: this.getQuery
        });
    }
}
