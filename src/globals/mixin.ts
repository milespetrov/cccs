import { Vue, Component } from 'vue-property-decorator';
import { Getter, Action, State, namespace } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';

const StateApp = namespace('app', State);
const GetterApp = namespace('app', Getter);
const ActionApp = namespace('app', Action);

/**
 * to use:
 * 'extends mixins(UpdateRouteMixin)'
 * Then everything on this class will be available
 */
@Component
export class UpdateRouteMixin extends Vue {
    @GetterApp
    getQuery: Dictionary<string>;

    @ActionApp
    setInternalRouteUpdate: (value: boolean) => void;

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
