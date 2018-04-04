import { AppState } from '@/store/state';
import { ChartConfigType } from '@/types';

/**
 * A collection of callbacks which can be passed to the chart config generator.
 *
 * @export
 * @interface ChartConfigCallbacks
 */
export interface ChartConfigCallbacks {
    /**
     * Fires on a chart series `hide` event.
     *
     * @memberof ChartConfigCallbacks
     */
    hide: (s: number[]) => void;
    /**
     * Fires on a chart series `show` event.
     *
     * @memberof ChartConfigCallbacks
     */
    show: (s: number[]) => void;
    /**
     * Fires on plot `setExtremes` event.
     *
     * @memberof ChartConfigCallbacks
     */
    setExtremes: (event: any) => void;
}

/**
 * A base chart config generator class. All specific dataset chart config generators inherit this one.
 *
 * @export
 * @class ChartConfigGenerator
 */
export class ChartConfigGenerator {
    protected state: AppState;
    protected callbacks: ChartConfigCallbacks;

    constructor(state: AppState) {
        this.state = state;
    }

    /**
     * Generates a chart config object based on the state, and chart config type provied.
     *
     * @param {ChartConfigType} chartConfigType a type of the chart config to be generated
     * @param {ChartConfigCallbacks} [callbacks] callbacks to be used in the chart config
     * @returns {Promise<any>} chart config returned in a promise
     * @memberof ChartConfigGenerator
     */
    make(chartConfigType: ChartConfigType, callbacks?: ChartConfigCallbacks): Promise<any> {
        this.callbacks = callbacks || {
            hide: () => {},
            show: () => {},
            setExtremes: () => {}
        };

        return Promise.resolve();
    }
}
