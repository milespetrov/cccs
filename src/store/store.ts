import Vue from 'vue';
import Vuex from 'vuex';

import { app } from './app';
import { AppState } from './state';

Vue.use(Vuex);

// TODO: What is this for?
const debug: boolean = true; //process.env.NODE_ENV !== 'production'

export const createStore = () => new Vuex.Store<AppState>(app);
