<template>
    <div id="cip-time-slider-container" :class="['layers-' + timeSliderLabels.length]">
        <div id="cip-time-slider-backdrop"></div>
        <div id="target" class="noUi-target noUiSlider"></div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import noUiSlider from 'nouislider';
import { Action, State } from 'vuex-class';
import { mixins } from 'vue-class-component/lib/util';
import { UpdateRouteMixin } from './../globals/mixin';
import { Getter } from 'vuex-class/lib/bindings';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/sampleTime';

@Component
export default class TimeSlider extends mixins(UpdateRouteMixin) {
    slider: any;

    @Getter timeSliderLabels: string[];

    @Action setTimeSlice: (value: number) => void;
    @State timeSlice: number;

    internalTimeSliceChange = false;
    pipSelector = '.noUi-value-large[data-value="';

    mounted(): void {
        if (!this.timeSlice) {
            this.setTimeSlice(0);
        }
        this.slider = document.getElementById('target');
        noUiSlider.create(this.slider, {
            start: this.timeSlice,
            step: 1,
            range: {
                min: 0,
                max: this.timeSliderLabels.length - 1
            },
            pips: {
                mode: 'steps',
                density: 0,
                format: {
                    to: (val: number) => {
                        return this.timeSliderLabels[val];
                    }
                },
                filter: (val: number) => {
                    if (val % 1 === 0) {
                        return 1;
                    }
                    return 0;
                }
            }
        });

        // add a click handler to each 'pip' (the labels)
        const pips = this.slider.querySelectorAll('.noUi-value');
        pips.forEach((pip: any) => {
            pip.addEventListener('click', this.clickOnPip);
        });

        /**
         * update is fired when:
         *  - slider is dragged over a value
         *  - value is set using noUiSlider.set(..);
         *  - slider is moved by tapping position
         *  - this event gets bound
         */
        this.slider.noUiSlider.on('update', () => {
            // get the new value and make sure something changed
            const newValue = Number(this.slider.noUiSlider.get().split('.')[0]);
            if (this.timeSlice === newValue) {
                return;
            }

            // selection has changed, set the time slice
            this.internalTimeSliceChange = true;
            this.setTimeSlice(newValue);
            this.updateRoute();
        });

        this.keyboardSupport();
        this.$el.querySelector(this.pipSelector + `${this.timeSlice}"]`)!.classList.add('selected');
    }

    @Watch('timeSlice')
    thing(newValue: number, oldValue: number): void {
        // Update the selected css class on the old and new selections
        this.$el.querySelector(this.pipSelector + `${oldValue}"]`)!.classList.remove('selected');
        this.$el.querySelector(this.pipSelector + `${newValue}"]`)!.classList.add('selected');

        if (this.internalTimeSliceChange) {
            // Flag set in 'on update' subscription, skip setting the slider again
            this.internalTimeSliceChange = false;
            return;
        }

        // timeslice was changed by something else, update the slider
        this.slider.noUiSlider.set(this.timeSlice);
    }

    clickOnPip(event: any): void {
        // set the slider value to the clicked pip's value
        // will move the slider to that pip
        const value = parseInt(event.path[0].getAttribute('data-value'));
        this.slider.noUiSlider.set(value);
        //this.slider.noUiSlider.set(value);
    }

    // based on a subset of our DQV keyboard support
    keyboardSupport(): void {
        const KEYCODES = {
            RIGHT_ARROW: 39,
            LEFT_ARROW: 37,
            END: 35,
            HOME: 36
        };

        const sliderHandle = this.slider.querySelector('.noUi-handle');

        // create event stream for the keyevents we want
        const keydownEvents: Observable<KeyboardEvent> = Observable.fromEvent(sliderHandle, 'keydown').filter(
            (event: KeyboardEvent) => {
                return Object.values(KEYCODES).indexOf(event.keyCode) !== -1;
            }
        ) as Observable<KeyboardEvent>;

        // stop the default handlers for the events
        // (i.e. don't let end go to the bottom of the page when the handle is selected)
        keydownEvents.subscribe((event: KeyboardEvent) => {
            event.preventDefault();
            event.stopPropagation();
        });

        // throttle the stream very slightly
        keydownEvents.sampleTime(30).subscribe((event: KeyboardEvent) => {
            if (event.keyCode === KEYCODES.RIGHT_ARROW) {
                // Move one selection right (if not at the end)
                if (this.timeSlice! < this.timeSliderLabels.length - 1) {
                    this.slider.noUiSlider.set(this.timeSlice! + 1);
                }
            } else if (event.keyCode === KEYCODES.LEFT_ARROW) {
                // Move one selection left (if not at the start)
                if (this.timeSlice! > 0) {
                    this.slider.noUiSlider.set(this.timeSlice! - 1);
                }
            } else if (event.keyCode === KEYCODES.END) {
                // Move to the end
                this.slider.noUiSlider.set(this.timeSliderLabels.length - 1);
            } else if (event.keyCode === KEYCODES.HOME) {
                // Move to the start
                this.slider.noUiSlider.set(0);
            }
        });
    }
}
</script>

<style lang="scss" scoped>
#cip-time-slider-container /deep/ {
    @import './../../node_modules/nouislider/distribute/nouislider';
    display: flex;
    align-items: center;
    margin: 10px 0;
    border: none;
    font-family: Helvetica, Arial, sans-serif;
    #cip-time-slider-backdrop {
        background: white;
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
            0px 3px 1px -2px rgba(0, 0, 0, 0.12);
        height: 32px;
        position: absolute;
    }
    cursor: pointer;

    // add a bit of padding around the slider container to accomodate for the entry field on the sides
    .noUi-target {
        flex: 1; // fill the available width of the slider container
        //margin: 0 20px;

        background: none;
        border: none;
        box-shadow: none;
    }

    .noUi-pips-horizontal {
        top: -23px;
        color: #4a4a4a;
        font-size: 0.9em;
        height: 0px;
        padding: 0%;
        .noUi-value-large {
            cursor: pointer;
            padding: 6px 0px;
            &.selected {
                font-weight: bold;
            }
        }

        .noUi-marker-normal,
        .noUi-marker-large {
            display: none;
        }
    }
    // these two blocks are taken from the noUiSlider styles and modified to select on the `html:not([dir='rtl'])` element outside the DQV scope
    // otherwise, the slider appearance will only work in `rtl` pages
    /* Offset direction
    */
    .noUi-base .noUi-origin {
        html:not([dir='rtl']) & {
            left: auto;
            right: 0;
        }
    }
    .noUi-base .noUi-handle {
        &::before,
        &::after {
            content: none !important;
        }
        html:not([dir='rtl']) & {
            left: auto;
            top: -7px;
            border-radius: 0;
            height: 32px;
            background: none;
            box-shadow: none;
            border: none;
            border-bottom: 3px solid #335075;
        }
    }
}

$max-layers: 4;
// Spacing for different amounts of layers
// This is based on the amount of layers in the selector
@for $i from 4 through $max-layers {
    #cip-time-slider-container.layers-#{$i} /deep/ {
        // the container is the width of i-1 labels
        $selection-width: calc(100% / (#{$i} - 1));

        // set the width of the handle (and move it correctly over the labels)
        .noUi-base .noUi-handle {
            html:not([dir='rtl']) & {
                right: calc((100% /#{$i}) / -2);
                width: calc(100% /#{$i});
            }
        }

        // set the width of the white div behind the slider
        #cip-time-slider-backdrop {
            width: calc(#{$selection-width} * #{$i});
            left: calc(#{$selection-width} / -2);
        }

        // widens the label div so it makes a larger area clickable
        .noUi-pips-horizontal .noUi-value-large {
            width: $selection-width;
        }
    }
}
</style>
