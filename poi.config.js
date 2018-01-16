const pkg = require('./package.json');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

const minimize = true;

module.exports = {
    vendor: false,
    html: {
        title: pkg.productName || pkg.name,
        description: pkg.description,
        template: 'src/index.ejs'
    },
    filename: {
        js: `cpi-sandbox${minimize ? '.min' : ''}.js`
    },
    minimize: minimize,
    presets: [
        // there is problem with using babel-minify for now: https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/68
        // require('poi-preset-babel-minify')({}, { comments: false }),
        require('poi-preset-typescript')(),
        require('poi-preset-karma')({
            port: 5001, // default
            files: ['test/unit/*.ts'] // default,
        })
    ],
    extendWebpack(config) {
        config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js'); // vue.esm include template compiler; without it all templates need to be pre-compiled

        // enable to see the bundle structure
        // config.plugin('bundleAnalyzer').use(BundleAnalyzerPlugin);
    },
    karma: {
        mime: {
            'text/x-typescript': ['ts']
        },
        preprocessors: {
            'test/unit/*.ts': ['webpack', 'sourcemap']
        }
    }
};
