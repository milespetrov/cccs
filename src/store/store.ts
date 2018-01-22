import Vue from 'vue';
import Vuex from 'vuex';

import { app } from './modules/app';

import { State as RootState } from './state';

Vue.use(Vuex);

// TODO: What is this for?
const debug: boolean = true; //process.env.NODE_ENV !== 'production'

export const createStore = () =>
    new Vuex.Store<RootState>({
        modules: {
            app
        }
    });
