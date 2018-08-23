<template>
    <div class="cip-date-slider-container">
        <span>{{this.selectedTime}}</span>
        <div class="cip-date-slider-backdrop"></div>
        <div class="noUi-target noUiSlider"></div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import noUiSlider from 'nouislider';
import { Action, State } from 'vuex-class';
import { mixins } from 'vue-class-component/lib/util';
import { UpdateRouteMixin } from './../globals/mixin';
import { Getter } from 'vuex-class/lib/bindings';

import { Observable, fromEvent } from 'rxjs';

import { filter } from 'rxjs/internal/operators/filter';
import { sampleTime } from 'rxjs/internal/operators/sampleTime';
import { i18n } from '@/lang';
import { TimePeriodType } from '@/types';

@Component
export default class DateSlider extends mixins(UpdateRouteMixin) {
    slider: any;

    @Action setTimeSlice: (value: number) => void;
    @State timeSlice: number;
    @State variableId: string;

    @Getter dateSlider: any;
    @Prop() step: string;

    @Prop() end: string;
    @Prop() default: string;
    get stepAmount(): number {
        return 1000 * 60 * 60 * parseInt(this.step);
    }
    get startDate(): Date {
        const date = new Date(this.end);
        date.setDate(date.getDate() - this.dateSlider[this.variableId].range);
        return date;
    }

    internalTimeSliceChange = false;

    selectedTime = this.formatDate(this.timeSlice);

    @Watch('stepAmount')
    async analysisPeriodChange(): Promise<void> {
        if (!this.slider.noUiSlider) {
            this.createSlider();
        }
        this.slider.noUiSlider.updateOptions({
            step: this.stepAmount,
            range: {
                min: this.startDate.getTime(),
                max: new Date(this.end).getTime()
            }
        });
    }

    mounted(): void {
        this.slider = this.$el.querySelector('.noUi-target');
    }

    createSlider(): void {
        if (!this.timeSlice) {
            this.internalTimeSliceChange = true;
            this.setTimeSlice(new Date(this.default).getTime());
            this.updateRoute();
        }
        const endDate = new Date(this.end);
        noUiSlider.create(this.slider, {
            start: this.timeSlice,
            step: this.stepAmount,
            range: {
                min: this.startDate.getTime(),
                max: endDate.getTime()
            },
            pips: {
                mode: 'range',
                density: 3,
                format: {
                    to: (value: number) => {
                        return new Date(value).toISOString().split('T')[0];
                    }
                }
            }
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
            this.selectedTime = this.formatDate(newValue);

            if (this.timeSlice === newValue) {
                return;
            }

            // selection has changed, set the time slice
            this.internalTimeSliceChange = true;
            this.setTimeSlice(newValue);
            this.updateRoute();
        });

        this.keyboardSupport();
    }

    @Watch('timeSlice')
    onTimeSliceChange(newValue: number, oldValue: number): void {
        if (this.internalTimeSliceChange) {
            // Flag set in 'on update' subscription, skip setting the slider again
            this.internalTimeSliceChange = false;
            return;
        }

        // timeslice was changed by something else, update the slider
        this.slider.noUiSlider.set(this.timeSlice);
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
                // Move one selection right
                this.slider.noUiSlider.set(this.timeSlice! + this.stepAmount);
            } else if (event.keyCode === KEYCODES.LEFT_ARROW) {
                // Move one selection left
                this.slider.noUiSlider.set(this.timeSlice! - this.stepAmount);
            } else if (event.keyCode === KEYCODES.END) {
                // Move to the end
                this.slider.noUiSlider.set(9999999999999);
            } else if (event.keyCode === KEYCODES.HOME) {
                // Move to the start
                this.slider.noUiSlider.set(0);
            }
        });
    }

    formatDate(datetime: number | undefined): string {
        if (!datetime) {
            return '';
        }
        const months = [
            TimePeriodType.January,
            TimePeriodType.February,
            TimePeriodType.March,
            TimePeriodType.April,
            TimePeriodType.May,
            TimePeriodType.June,
            TimePeriodType.July,
            TimePeriodType.August,
            TimePeriodType.September,
            TimePeriodType.October,
            TimePeriodType.November,
            TimePeriodType.December
        ];
        const date = new Date(datetime);

        const month = this.$i18n.t(`timePeriodSelector.${months[date.getUTCMonth()]}.fullName`);

        return `${month} ${date.getUTCDate()}, ${date.getUTCFullYear()}, ${date.getUTCHours()}:00 UTC`;
    }
}
</script>

<style lang="scss" scoped>
.cip-date-slider-container /deep/ {
    @import './../../node_modules/nouislider/distribute/nouislider';

    font-family: Helvetica, Arial, sans-serif;
    font-size: 0.9em;
    text-align: center;
    padding-right: 0.5rem;

    span {
        top: 2rem;
        position: relative;
    }

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

    .noUi-base {
        cursor: pointer;
        top: -2rem;
    }

    // hide most of the slider handle leaving a bottom border only
    .noUi-origin {
        .noUi-handle {
            &::before,
            &::after {
                height: 5px;
                top: 7px;
            }
            background: #335075;
            border: none;
            border-radius: 0;
            box-shadow: none;
            height: 20px;
            top: 0px;
            width: 32px;
            cursor: pointer;

            &.noUi-active {
                box-shadow: none !important;
            }
        }
    }

    // these two blocks are taken from the noUiSlider styles and modified to select on the `html:not([dir='rtl'])` element outside the DQV scope
    // otherwise, the slider appearance will only work in `rtl` pages
    /* Offset direction
    */
    .noUi-horizontal .noUi-origin {
        html:not([dir='rtl']) & {
            left: auto;
            right: 0;
        }
    }

    .noUi-horizontal .noUi-handle {
        right: -15px !important;
        html:not([dir='rtl']) & {
            right: -15px;
            left: auto;
        }
    }

    .noUi-pips {
        top: -2.3rem;
        .noUi-value {
            top: 2rem;
            left: 9% !important;
        }

        :last-child {
            left: 91% !important;
        }
    }
}
</style>
