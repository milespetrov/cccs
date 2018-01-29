import { ActionContext, Store, StoreOptions, Module } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';

import { AppState } from './app-state';
import { State as RootState } from './../../state';

type AppContext = ActionContext<AppState, RootState>;

const state: AppState = {
    isVariableSelectorOpen: true,

    timePeriodId: null,
    variableId: null,
    datasetId: null
};

// getters
// retuns Word collection from the WordsState store
const getters: { [name: string]: (a: any) => any } = {
    isVariableSelectorOpen: (state: AppState): boolean =>
        state.isVariableSelectorOpen,

    getTimePeriodId: (state: AppState): string | null => state.timePeriodId,

    getVariableId: (state: AppState): string | null => state.variableId,

    getDatasetId: (state: AppState): string | null => state.datasetId,

    // TODO: type the query object
    getQuery: (state: AppState): object => {
        const queryObject: { [name: string]: string } = {
            t: getters.getTimePeriodId(state),
            v: getters.getVariableId(state),
            d: getters.getDatasetId(state)
        };

        // remove null values from the query object
        Object.keys(queryObject).forEach(
            key => queryObject[key] == null && delete queryObject[key]
        );

        return queryObject;
    }
};

// actions
const actions = {};

// mutations
const mutations = {
    toggleVariableSelector(state: AppState, value: boolean): void {
        state.isVariableSelectorOpen = value;
    },

    setTimePeriodId(state: AppState, value: string): void {
        state.timePeriodId = value;
    },

    setVariableId(state: AppState, value: string): void {
        state.variableId = value;
    },

    setDatasetId(state: AppState, value: string): void {
        state.datasetId = value;
    }
};

// ugliest workaround
// see here for details: https://github.com/istrib/vuex-typescript/issues/13
// #region IEfix

/*
- IE11 has no support for `name` property on functions
- there is a polyfill that provides that functionality on name functions declarations and expressions https://github.com/JamesMGreene/Function.name

With that polyfill, only the named functions will get names; the `obj.foo2` is not a named function expression :/
```js
var obj = {
    foo1: function bar() {

    },

    foo2: function() {

    }
};

obj.foo1.name -> `bar`
obj.foo2.name -> `` // empty string
```

This is the enhanced object literal notation.
```ts
const obj = {
    foo: () => {}
};
```

When transpiled by Typescript, it gives you
```js
const obj = {
    foo: function() { // not named

    }
};
```

When transpiled by Babel with `es2015` preseetn, it gives you
```js
const obj = {
    foo: function foo() { // named

    }
};
```

Noticed that in Babel output the function is named, so the IE Function.name polyfill will properly set their names.
The current build process uses typescript to transpile code, hence the execrable hack below to set vuex keys.
*/

[getters, actions, mutations].forEach(dictionary =>
    Object.entries(dictionary).forEach(
        ([name, func]) => ((<any>func)._vuexKey = name)
    )
);

// #endregion

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

export const rGetQuery = read(getters.getQuery);
export const rTimePeriodId = read(getters.getTimePeriodId);
export const rVariableId = read(getters.getVariableId);
export const rDatasetId = read(getters.getDatasetId);

// actions
// export const dActionName = dispatch(actions.actionName);

//mutations
export const cToggleVariableSelector = commit(mutations.toggleVariableSelector);

export const cTimePeriodId = commit(mutations.setTimePeriodId);
export const cVariableId = commit(mutations.setVariableId);
export const cDatasetId = commit(mutations.setDatasetId);
