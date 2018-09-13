import { ActionContext, StoreOptions } from 'vuex';

import { DataState } from './data-state';
import { RootState } from '@/store';
import { BreadCrumbEntity } from '@/types';

type DataContext = ActionContext<DataState, RootState>;

const state: DataState = {
    urlSuffixes: null,
    dataCatalogueUrl: null,
    dataQueryUrl: null,
    languageToggleDomain: null,
    breadCrumbUrls: []
};

enum Action {
    setUrlSuffixes = 'setUrlSuffixes',
    setDataCatalogueUrl = 'setDataCatalogueUrl',
    setDataQueryUrl = 'setDataQueryUrl',
    setLanguageToggleDomain = 'setLanguageToggleDomain',
    setBreadCrumbUrls = 'setBreadCrumbUrls'
}

enum Mutation {
    SET_URL_SUFFIXES = 'SET_URL_SUFFIXES',
    SET_DATA_CATALOGUE_URL = 'SET_DATA_CATALOGUE_URL',
    SET_DATA_QUERY_URL = 'SET_DATA_QUERY_URL',
    SET_LANGUAGE_TOGGLE_DOMAIN = 'SET_VIEWER_DOMAIN_NAME',
    SET_BREAD_CRUMB_URLS = 'SET_BREAD_CRUMB_URLS'
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
    },
    [Action.setLanguageToggleDomain](context: DataContext, value: string): void {
        context.commit(Mutation.SET_LANGUAGE_TOGGLE_DOMAIN, value);
    },
    [Action.setBreadCrumbUrls](context: DataContext, value: BreadCrumbEntity[]): void {
        context.commit(Mutation.SET_BREAD_CRUMB_URLS, value);
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
    },
    [Mutation.SET_LANGUAGE_TOGGLE_DOMAIN](state: DataState, value: string): void {
        state.languageToggleDomain = value;
    },
    [Mutation.SET_BREAD_CRUMB_URLS](state: DataState, value: BreadCrumbEntity[]): void {
        state.breadCrumbUrls = value;
    }
};

export const data = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
