import { Vue, Watch, Component, Prop, Inject } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';

/**
 * to use:
 * 'extends mixins(UpdateRouteMixin)'
 * Then everything on this class will be available
 */
@Component
export class UpdateRouteMixin extends Vue {
    @Getter getQuery: Dictionary<string>;

    @Action setInternalRouteUpdate: (value: boolean) => void;

    // Updates the router using the in-store view and query variables
    updateRoute(): void {
        this.setInternalRouteUpdate(true);
        this.$router.push({
            query: this.getQuery
        });
    }

    replaceRoute(): void {
        this.setInternalRouteUpdate(true);
        this.$router.replace({
            query: this.getQuery
        });
    }
}
