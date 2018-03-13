// tslint:disable:no-unused-expression
// ^ TODO? Custom rule?
// Basic imports for testing
import Vue from 'vue';
import { shallow, mount, createLocalVue } from '@vue/test-utils';
import chai, { expect, should } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import Vuex from 'vuex';

import Dropdown from 'bootstrap-vue/es/components/dropdown';

// Allows us to spy on functions
chai.use(sinonChai);

// Need to do this to appease vue things
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Dropdown);

// Appeasing Vue some more
const $t = () => undefined;

// Import the module we're testing
import baseSelectorV from './../../src/components/vis-controls/base-selector.vue';
import { BaseSelectorConfig, BaseSelectorGroupConfig } from '../../src/configs';

describe('base-selector.vue', () => {
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
