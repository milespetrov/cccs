// tslint:disable:no-unused-expression
// ^ TODO? Custom rule?
// Basic imports for testing
import Vue from 'vue';
import { mount, shallow, createLocalVue } from '@vue/test-utils';
import chai, { expect, should } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import Vuex from 'vuex';
import noUiSlider from 'nouislider';

// Allows us to spy on functions
chai.use(sinonChai);

// Need to do this to appease vue things
const localVue = createLocalVue();
localVue.use(Vuex);

// Appeasing Vue some more
const $t = () => undefined;

import TimeSlider from 'src/components/time-slider.vue';

describe('time-slider.vue', () => {
    let $router: any;

    // store mock
    const store = new Vuex.Store({
        getters: {
            timeSliderLabels: () => ['a', 'b', 'c', 'd'],
            getQuery: () => {}
        },
        actions: {
            setInternalRouteUpdate: () => {},
            setTimeSlice: () => {}
        },
        state: {
            timeSlice: 0
        }
    });

    beforeEach(() => {
        // reset route
        $router = {
            currentRoute: {
                query: {}
            },

            push: () => undefined,
            afterEach: () => undefined
        };
    });

    afterEach;

    it('should be a vue instance', () => {
        const wrapper = shallow(TimeSlider, {
            store,
            localVue,
            attachToDocument: true
        });

        expect(wrapper.isVueInstance());
        // remove wrapper from the DOM
        wrapper.destroy();
    });

    it('should increment the timeSlice on right_arrow press', done => {
        const setTimeSlice = sinon.spy();
        const timeSlice = 0;
        const wrapper = mount(TimeSlider, {
            store,
            localVue,
            attachToDocument: true,
            methods: {
                setTimeSlice
            },
            mocks: {
                $router,
                timeSlice
            }
        });

        wrapper.find('.noUi-handle').trigger('keydown.right');
        // timeout due to buffer on keypress stream
        setTimeout(() => {
            expect(setTimeSlice).to.be.calledWith(timeSlice + 1);

            // remove wrapper from the DOM
            wrapper.destroy();
            done();
        }, 30);
    });

    it('should decrement the timeSlice on left_arrow press', done => {
        const setTimeSlice = sinon.spy();
        const timeSlice = 1;
        const wrapper = mount(TimeSlider, {
            store,
            localVue,
            attachToDocument: true,
            methods: {
                setTimeSlice
            },
            mocks: {
                $router,
                timeSlice
            }
        });

        wrapper.find('.noUi-handle').trigger('keydown.left');
        // timeout due to buffer on keypress stream
        setTimeout(() => {
            expect(setTimeSlice).to.be.calledWith(timeSlice - 1);
            wrapper.destroy();
            done();
        }, 30);
    });

    it('should set timeSlice to the first position on home press', done => {
        const setTimeSlice = sinon.spy();
        const timeSlice = 1;
        const wrapper = mount(TimeSlider, {
            store,
            localVue,
            attachToDocument: true,
            methods: {
                setTimeSlice
            },
            mocks: {
                $router,
                timeSlice
            }
        });

        wrapper.find('.noUi-handle').trigger('keydown.home');
        // timeout due to buffer on keypress stream
        setTimeout(() => {
            expect(setTimeSlice).to.be.calledWith(0);
            wrapper.destroy();
            done();
        }, 30);
    });

    it('should set timeSlice to the last position on end press', done => {
        const setTimeSlice = sinon.spy();
        const timeSlice = 1;
        const wrapper = mount(TimeSlider, {
            store,
            localVue,
            attachToDocument: true,
            methods: {
                setTimeSlice
            },
            mocks: {
                $router,
                timeSlice
            }
        });

        wrapper.find('.noUi-handle').trigger('keydown.end');
        // timeout due to buffer on keypress stream
        setTimeout(() => {
            expect(setTimeSlice).to.be.calledWith(store.getters.timeSliderLabels.length - 1);
            wrapper.destroy();
            done();
        }, 30);
    });

    it('should move to a position and set timeSlice on click', () => {
        const setTimeSlice = sinon.spy();
        const timeSlice = 1;
        const wrapper = mount(TimeSlider, {
            store,
            localVue,
            attachToDocument: true,
            methods: {
                setTimeSlice
            },
            mocks: {
                $router,
                timeSlice
            }
        });

        wrapper.find('.noUi-value-large[data-value="2"]').trigger('click');
        expect(setTimeSlice).to.be.calledWith(2);
    });
});
