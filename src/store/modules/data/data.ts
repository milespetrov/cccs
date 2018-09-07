import { ActionContext, StoreOptions } from 'vuex';

import { DataState } from './data-state';
import { RootState } from '@/store';

type DataContext = ActionContext<DataState, RootState>;

const state: DataState = {
    urlSuffixes: null,
    dataCatalogueUrl: null,
    dataQueryUrl: null
};

enum Action {
    setUrlSuffixes = 'setUrlSuffixes',
    setDataCatalogueUrl = 'setDataCatalogueUrl',
    setDataQueryUrl = 'setDataQueryUrl'
}

enum Mutation {
    SET_URL_SUFFIXES = 'SET_URL_SUFFIXES',
    SET_DATA_CATALOGUE_URL = 'SET_DATA_CATALOGUE_URL',
    SET_DATA_QUERY_URL = 'SET_DATA_QUERY_URL'
}

// getters
const getters = {};

// actions
const actions = {
    [Action.setUrlSuffixes](context: DataContext, value: object): void {
        context.commit(Mutation.SET_URL_SUFFIXES, value);
    },
    [Action.setDataCatalogueUrl](context: DataContext, value: string): void {
        context.commit(Mutation.SET_DATA_CATALOGUE_URL, value);
    },
    [Action.setDataQueryUrl](context: DataContext, value: string): void {
        context.commit(Mutation.SET_DATA_QUERY_URL, value);
    }
};

// mutations
const mutations = {
    [Mutation.SET_URL_SUFFIXES](state: DataState, value: object): void {
        state.urlSuffixes = value;
    },
    [Mutation.SET_DATA_CATALOGUE_URL](state: DataState, value: string): void {
        state.dataCatalogueUrl = value;
    },
    [Mutation.SET_DATA_QUERY_URL](state: DataState, value: string): void {
        state.dataQueryUrl = value;
    }
};

export const data = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
