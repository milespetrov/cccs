<template>
    <div class="cip-time-slider-container" :class="`layers-${timeSliderLabels ? timeSliderLabels.length : 0}`">
        <div class="cip-time-slider-backdrop"></div>
        <div class="noUi-target noUiSlider"></div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import noUiSlider from 'nouislider';
import { Action, State, namespace } from 'vuex-class';
import { mixins } from 'vue-class-component/lib/util';
import { UpdateRouteMixin } from './../globals/mixin';
import { Getter } from 'vuex-class/lib/bindings';

import { Observable, fromEvent } from 'rxjs';

import { filter } from 'rxjs/internal/operators/filter';
import { sampleTime } from 'rxjs/internal/operators/sampleTime';

const StateApp = namespace('app', State);
const GetterApp = namespace('app', Getter);
const ActionApp = namespace('app', Action);

@Component
export default class TimeSlider extends mixins(UpdateRouteMixin) {
    slider: any;

    @GetterApp
    timeSliderLabels: string[];

    @ActionApp
    setTimeSlice: (value: number) => void;
    @StateApp
    timeSlice: number;

    internalTimeSliceChange = false;
    pipSelector = '.noUi-value-large[data-value="';

    mounted(): void {
        if (!this.timeSlice) {
            this.setTimeSlice(3);
        }
        this.slider = this.$el.querySelector('.noUi-target');
        noUiSlider.create(this.slider, {
            start: this.timeSlice,
            step: 1,
            range: {
                min: 0,
                max: this.timeSliderLabels.length - 1
            },
            pips: {
                mode: 'steps',
                density: 100,
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
            },
            ariaFormat: {
                to: (value: number) => {
                    return this.timeSliderLabels[value];
                },
                from: (value: string) => {
                    return this.timeSliderLabels.indexOf(value);
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
    onTimeSliceChange(newValue: number, oldValue: number): void {
        if (!this.timeSliderLabels) {
            return;
        }

        // Update the selected css class on the old and new selections
        if (oldValue !== null) {
            this.$el.querySelector(this.pipSelector + `${oldValue}"]`)!.classList.remove('selected');
        }
        if (newValue !== null) {
            this.$el.querySelector(this.pipSelector + `${newValue}"]`)!.classList.add('selected');
        }

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
        const value = parseInt(event.target.getAttribute('data-value'));
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

        // to have an element focusable inside the RAMP container, its tabindex must not be 0;
        // tabindex 0 is controlled by the browser; RAMP focus manager will ignore such elements and not set focus to them;
        const sliderHandle = this.slider.querySelector('.noUi-handle') as HTMLElement;
        sliderHandle.setAttribute('tabindex', '-2');
        sliderHandle.setAttribute('aria-labelledby', 'cip-timeSlider-label');

        // create event stream for the keyevents we want
        const keydownEvents: Observable<KeyboardEvent> = fromEvent(sliderHandle, 'keydown').pipe(
            filter((event: KeyboardEvent) => {
                return Object.values(KEYCODES).indexOf(event.keyCode) !== -1;
            })
        ) as Observable<KeyboardEvent>;

        // stop the default handlers for the events
        // (i.e. don't let end go to the bottom of the page when the handle is selected)
        keydownEvents.subscribe((event: KeyboardEvent) => {
            event.preventDefault();
            event.stopPropagation();
        });

        // throttle the stream very slightly
        keydownEvents.pipe(sampleTime(30)).subscribe((event: KeyboardEvent) => {
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
.cip-time-slider-container /deep/ {
    @import "./../../node_modules/nouislider/distribute/nouislider";

    font-family: "Noto Sans", sans-serif;
    font-size: 0.9em;
    padding: 0.5rem 0;

    cursor: pointer;

    // hide the slider connect node
    .noUi-connects {
        display: none;
    }

    // hide the slider rail
    .noUi-target {
        border: none;
        background: none;
        box-shadow: none;
    }

    // hide most of the slider handle leaving a bottom border only
    .noUi-origin {
        .noUi-handle {
            &::before,
            &::after {
                content: none !important;
            }

            background: none;
            box-shadow: none;
            border: none;
            border-radius: 0;
            border-bottom: 3px solid #335075;
        }
    }

    .noUi-pips {
        top: 0;
        height: auto;
        padding: 0;

        // reposition slider values on top of the slider rail
        .noUi-value {
            color: #4a4a4a;

            transform: translate(-50%, 0);

            &.selected {
                font-weight: bold;
            }
        }

        // hide large slider value pips
        .noUi-marker {
            display: none;
        }
    }

    // these two blocks are taken from the noUiSlider styles and modified to select on the `html:not([dir='rtl'])` element outside the DQV scope
    // otherwise, the slider appearance will only work in `rtl` pages
    /* Offset direction
    */
    .noUi-horizontal .noUi-origin {
        html:not([dir="rtl"]) & {
            left: auto;
            right: 0;
        }
    }

    .noUi-horizontal .noUi-handle {
        html:not([dir="rtl"]) & {
            right: -17px;
            left: auto;
        }
    }
}

$max-layers: 4;

// Spacing for different amounts of layers
// This is based on the amount of layers in the selector
@for $i from 4 through $max-layers {
    .cip-time-slider-container.layers-#{$i} /deep/ {
        margin: 0 calc(100% / #{$i} / 2);

        // make handle a tiny bit wider than a label, so the bottom border of the handle protrudes beyond the label boundaries
        $handle-width: 100% / #{$i} + 1rem;

        // set the width of the handle (and move it correctly over the labels)
        .noUi-origin .noUi-handle {
            width: calc(#{$handle-width});
            right: calc((#{$handle-width}) / -2) !important;
        }
    }
}
</style>
