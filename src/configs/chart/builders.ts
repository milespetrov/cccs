import ahccdBuilder from './ahccd-temp';
import cmip5Builder from './cmip5-temp';

interface BuilderDetails {
    data: any;
    period: string;
    variable: string;
    featureId: string;
    callbacks: any;
    mini?: boolean;
}

interface BuilderObject {
    [key: string]: (builderDetails: BuilderDetails) => object;
}

export default <BuilderObject>{
    ahccd: ahccdBuilder,
    cmip5: cmip5Builder
};
