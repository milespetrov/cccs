<template>
    <div class="colour-ramp">
        
        <span class="range-label range-left">{{ labels[0] }}</span>

        <div class="colours" :style="{ background: backgroundGradient }">
            <!-- <span class="range-label">-75</span>
            <span class="range-label">-25</span> -->
            <!-- <span class="range-label range-middle">0</span> -->
            <!-- <span class="range-label">25</span>    
            <span class="range-label">75</span> -->
        </div>

        <span class="range-label range-right">{{ labels[1] }}</span>

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
    colours: string[];

    /**
     * Returns the value for the background of the colour ramp using the colours provided in the dataset config.
     */
    get backgroundGradient(): string {
        return `linear-gradient(to right, ${this.colours.join(',')})`;
    }
}
</script>

<style lang="scss" scoped>
// TODO: clean up unused styles
.colour-ramp {
    width: 400px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 6px 8px;
    background: #ffffff;

    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
        0px 3px 1px -2px rgba(0, 0, 0, 0.12);
}

.range-label {
    line-height: 1em;
    font-size: 0.8em;
    font-family: Helvetica, Arial, sans-serif;
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
}

.title {
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    font-size: 14px;
    flex-shrink: 0;
    padding: 0 0 6px 0;
}
</style>


