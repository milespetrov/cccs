<template>
    <div class="colour-ramp">
        <span class="range-label range-left">&le; {{ labels[0] }}</span>

        <div class="colours" :style="{ background: backgroundGradient }">
            <div :class="(tick[0]==='0') ? 'zero-tick' : 'tick'" v-for="tick in ticks" :key="tick" :style="{left: tick[1]+'%'}">
                <span :style="{left: '-'+labelPlacement(tick[0])+'px'}">{{ tick[0] }}</span>
            </div>
        </div>

        <span class="range-label range-right">&ge; {{ labels[1] }}</span>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';

@Component
export default class MapColourRamp extends Vue {
    @Prop({ default: ['-100', '100'] })
    labels: [string, string];

    @Prop({
        default: ['#fff', '#000']
    })
    colours: string[] | string[][];

    @Prop({
        default: []
    })
    ticks: string[][];

    /**
     * Returns the value for the background of the colour ramp using the colours provided in the dataset config.
     */
    get backgroundGradient(): string {
        if (typeof this.colours[0] === 'string') {
            return `linear-gradient(to right, ${this.colours.join(',')})`;
        }
        return `linear-gradient(to right, ${(<string[][]>this.colours)
            .map(value => `${value[0]} ${value[1]}%`)
            .join(',')})`;
    }

    labelPlacement(label: string): number {
        let placement: number = 0;

        // '-' adds 3px needed
        if (label.startsWith('-')) {
            placement += 3;
            label = label.slice(1);
        }

        // 4px per character except for first
        placement += 4*label.length - 1;

        return placement;
    }
}
</script>

<style lang="scss" scoped>
// TODO: clean up unused styles
.colour-ramp {
    position: relative;
    display: flex;
    align-items: center;
    padding: 1rem 0 0.5rem;
    top: 4px;
}

.range-label {
    line-height: 1em;
    font-size: 0.8em;
    font-family: "Noto Sans", sans-serif;
    @media (max-width: 440px) {
        font-size: 0.7em;
    }
}

.range-left,
.range-right {
    color: black;
}

.range-middle {
    position: absolute;
    left: 0;
    right: 0;
}

.colours {
    flex: 1;
    // background: linear-gradient(to right, #733e05, #d6af67, #eff0ed, #6bbfb1, #023d32);
    display: flex;
    padding: 3px 0 2px 0;
    margin: 0 6px;
    position: relative;

    height: 1em;

    .range-label {
        text-align: center;
        flex: 1;

        &:nth-child(1),
        &:nth-child(4) {
            color: #ffffff;
        }

        &:nth-child(2),
        &:nth-child(3) {
            color: #000000;
        }
    }

    .tick, .zero-tick {
        width: 4px;
        top: -0.2em;
        background: black;
        position: absolute;
        border: white;
        border-style: solid;
        border-width: 1.5px;

        span {
            top: -15px;
            font-size: 0.8em;
            position: absolute;
            @media (max-width: 440px) {
                font-size: 0.7em;
            }
            background-color: white;
        }
    }

    .tick {
        height: 0.4em;
    }

    .zero-tick {
        height: 0.9em;
    }
}
</style>
