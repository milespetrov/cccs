import { Vue, Component } from 'vue-property-decorator';
import { Getter, Action, State, namespace } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';
import { DatasetId, VariableId, BreadCrumbEntity } from '@/types';

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

@Component
export class StoreAppMixin extends Vue {
    @ActionApp
    setTimePeriodId: (value: string | null) => void;

    @ActionApp
    setVariableId: (value: string | null) => void;

    @ActionApp
    setDatasetId: (value: string | null) => void;

    @ActionApp
    setFeatureId: (value: string | null) => void;

    @ActionApp
    setCenterPoint: (value: string | null) => void;

    @ActionApp
    setZoomLevel: (value: string | null) => void;

    @ActionApp
    setTimeSlice: (value: number | null) => void;

    @ActionApp
    setFeaturePoint: (value: { x: number; y: number } | string | null) => void;

    @ActionApp
    setRcpId: (value: string | null) => void;

    @ActionApp
    setAnalysisPeriod: (value: string | null) => void;

    @ActionApp
    setMonth: (value: string | null) => void;

    @ActionApp
    setDay: (value: number | null) => void;

    @ActionApp
    setSupplementalIds: (value: string[]) => void;

    @ActionApp
    setInternalRouteUpdate: (value: boolean) => void;

    @StateApp
    internalRouteUpdate: boolean;

    @StateApp
    datasetId: DatasetId;

    @StateApp
    variableId: VariableId;
}

const StateData = namespace('data', State);
const ActionData = namespace('data', Action);

@Component
export class StoreDataMixin extends Vue {
    @ActionData
    setUrlSuffixes: (value: object) => void;

    @ActionData
    setDataCatalogueUrl: (value: string) => void;

    @ActionData
    setDataQueryUrl: (value: string) => void;

    @ActionData
    setLanguageToggleDomain: (value: string) => void;

    @ActionData
    setBreadCrumbUrls: (value: BreadCrumbEntity[]) => void;

    @StateData
    urlSuffixes: object | null;

    @StateData
    dataQueryUrl: string | null;

    @StateData
    languageToggleDomain: string | null;

    @StateData
    breadCrumbUrls: BreadCrumbEntity[];
}
