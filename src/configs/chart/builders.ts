import ahccdBuilder from './ahccd-temp';
import cmip5Builder from './cmip5-temp';

/**
 *  Parameters taken by builder functions
 *
 *  @interface BuilderDetails
 */
interface BuilderDetails {
    /**
     * id for the time period
     *
     * @type {string}
     * @memberof BuilderDetails
     */
    period: string;
    /**
     * id for the variable
     *
     * @type {string}
     * @memberof BuilderDetails
     */
    variable: string;

    /**
     * id for the feature
     *
     * @type {string}
     * @memberof BuilderDetails
     */
    featureId: string;

    /**
     * Object containing callback functions
     *
     * @type {any}
     * @memberof BuilderDetails
     */
    callbacks: any;

    /**
     * Flag to build the mini chart. Pass as true to build the minichart.
     *
     * @type {boolean}
     * @memberof BuilderDetails
     */
    mini?: boolean;

    chartSeries?: number[];
}

/**
 * Interface mapping datasetKeys to builder functions
 *
 * @interface BuilderObject
 */
interface BuilderObject {
    [key: string]: (builderDetails: BuilderDetails) => object;
}

export default <BuilderObject>{
    ahccd: ahccdBuilder,
    cmip5: cmip5Builder
};

export { BuilderDetails };
