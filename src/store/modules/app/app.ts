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

// actions
// export const dActionName = dispatch(actions.actionName);

//mutations
export const cToggleVariableSelector = commit(mutations.toggleVariableSelector);
