import { ActionContext, Store, StoreOptions, Module } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';

import { AppState } from './app-state';
import { State as RootState } from './../../state';

type AppContext = ActionContext<AppState, RootState>;

const state: AppState = {
    isVariableSelectorOpen: true
};

// getters
// retuns Word collection from the WordsState store
const getters = {
    isVariableSelectorOpen: (state: AppState): boolean =>
        state.isVariableSelectorOpen
};

// actions
const actions = {};

// mutations
const mutations = {
    toggleVariableSelector(state: AppState, value: boolean): void {
        state.isVariableSelectorOpen = value;
    }
};

export const app: Module<AppState, RootState> = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

const { commit, read, dispatch } = getStoreAccessors<AppState, RootState>(
    'app'
);

// getters
export const rIsVariableSelectorOpen = read(getters.isVariableSelectorOpen);

// actions
// export const dActionName = dispatch(actions.actionName);

//mutations
export const cToggleVariableSelector = commit(mutations.toggleVariableSelector);
