// tslint:disable:no-unused-expression
// ^ TODO? Custom rule?
// Basic imports for testing
import Vue from 'vue';
import { shallow, mount, createLocalVue } from '@vue/test-utils';
import chai, { expect, should } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import Vuex, { Store } from 'vuex';

import Dropdown from 'bootstrap-vue/es/components/dropdown';

// Import the module we're testing
import baseSelectorV from './../../src/components/vis-controls/base-selector.vue';
import { BaseSelectorConfig, BaseSelectorGroupConfig } from './../../src/configs/selectors';

import { AppState, createStore } from '../../src/store';

import { app } from './../../src/store/app';
import { ViewType, DatasetId, VisualizationControlType, TimePeriodType, RCPType } from '@/types';

// Allows us to spy on functions
chai.use(sinonChai);

// Need to do this to appease vue things
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Dropdown);

// Appeasing Vue some more
const $t = () => undefined;

// const realStore: Store<AppState> = createStore();

describe('base-selector.vue', () => {
    it('apply selector defaults', () => {
        const state = {
            currentView: ViewType.MapView,
            datasetId: DatasetId.AHCCD,
            timePeriodId: null,
            rcpId: null
        };

        const getters = {
            datasetControlOptions: () => {
                return {
                    [ViewType.ChartView]: {
                        controls: {
                            [VisualizationControlType.Time]: {
                                default: TimePeriodType.January
                            },
                            [VisualizationControlType.RCP]: {
                                default: RCPType.RCP4_5
                            }
                        }
                    },
                    [ViewType.MapView]: {
                        controls: {
                            [VisualizationControlType.Time]: {
                                visible: false,
                                default: TimePeriodType.Annual,
                                options: [TimePeriodType.Annual]
                            }
                        }
                    }
                }[state.currentView];
            }
        };

        const actions = {
            setRcpId: (context: any, value: any) => {
                state.rcpId = value;
            },
            setTimePeriodId: (context: any, value: any) => {
                state.timePeriodId = value;
            },
            applyDatasetDefault: app.actions!.applyDatasetDefault
        };

        // store mock
        const store = new Vuex.Store({
            state: state as AppState,
            getters,
            actions
        });

        store.dispatch('applyDatasetDefault');
        expect(state.rcpId).equal(null);
        expect(state.timePeriodId).equal(TimePeriodType.Annual);

        store.state.currentView = ViewType.ChartView;
        store.dispatch('applyDatasetDefault');
        expect(state.rcpId).equal(RCPType.RCP4_5);
        expect(state.timePeriodId).equal(TimePeriodType.Annual);

        store.state.timePeriodId = null;
        store.dispatch('applyDatasetDefault');
        expect(state.timePeriodId).equal(TimePeriodType.January);

        store.state.currentView = ViewType.MapView;
        store.dispatch('applyDatasetDefault');
        expect(state.rcpId).equal(null);
        expect(state.timePeriodId).equal(TimePeriodType.Annual);
    });

    it('filter selector options', () => {
        const selectorConfig: BaseSelectorConfig = {
            groups: [
                {
                    id: 'no_header_many',
                    items: ['one', 'two', 'thee'],
                    showHeader: false
                },
                {
                    id: 'no_header_one',
                    items: ['one'],
                    showHeader: false
                },
                {
                    id: 'header_many',
                    items: ['one', 'two', 'thee'],
                    showHeader: true
                },
                {
                    id: 'header_one',
                    items: ['one'],
                    showHeader: true
                },
                {
                    id: 'header_default',
                    items: ['one', 'two', 'thee']
                },
                {
                    id: 'no_header_default',
                    items: ['one']
                },
                {
                    id: 'no_group',
                    items: ['four']
                },
                {
                    id: 'group_no_four',
                    items: ['one', 'two', 'thee', 'four']
                },
                {
                    id: 'group_no_four_no_header',
                    items: ['one', 'four']
                }
            ]
        };

        const wrapper = mount(baseSelectorV, {
            localVue,
            propsData: {
                config: selectorConfig,
                available: ['one', 'two', 'thee'],
                currentId: 'two'
            },
            mocks: {
                $t
            }
        });

        const filteredGroups: BaseSelectorGroupConfig[] = (<any>wrapper).vm.filteredGroups;

        // console.log(JSON.stringify(filteredGroups, null, '    '));

        expect(filteredGroups.length === 7);

        expect(filteredGroups[0].showHeader).equal(false);
        expect(filteredGroups[1].showHeader).equal(false);
        expect(filteredGroups[2].showHeader).equal(true);
        expect(filteredGroups[3].showHeader).equal(true);
        expect(filteredGroups[4].showHeader).equal(true);
        expect(filteredGroups[5].showHeader).equal(false);
        expect(filteredGroups[6].showHeader).equal(true);
        expect(filteredGroups[6].items).deep.equal(['one', 'two', 'thee']);
        // no_group has been filtered out
        expect(filteredGroups[7].showHeader).equal(false);
    });
});
