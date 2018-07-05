const pkg = require('./package.json');

const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const minimize = false;

module.exports = {
    vendor: false,
    html: [
        {
            title: pkg.productName || pkg.name,
            description: pkg.description,
            filename: 'climate-maps.html', // the name of the output file; the actual landing page will be named `index.html`
            template: 'src/index.en.ejs'
        },
        {
            title: pkg.productName || pkg.name,
            description: pkg.description,
            filename: 'cartes-climatiques.html', // the name of the output file; the actual landing page will be named `index.html`
            template: 'src/index.fr.ejs'
        }
    ],
    filename: {
        js: `cip-sandbox${minimize ? '.min' : ''}.js`
    },
    homepage: './',
    minimize: minimize,
    sourceMap: false,
    // copy the `assets` folder into `dist`
    copy: [
        {
            from: path.resolve(__dirname, 'assets'),
            to: path.resolve(__dirname, 'dist/assets'),
            ignore: ['.*']
        }
    ],
    // open the explore data page on localhost:3001 by default when running `npm run dev`
    /*  devServer: {
        index: 'explore-data-fr.html'
    }, */
    presets: [
        // there is problem with using babel-minify if you want to have source maps as well: https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/68
        // TODO: cannot uglify with babel without the EI hack in vuex store
        // see IE11 issue here for details https://github.com/istrib/vuex-typescript/issues/13
        // require('poi-preset-babel-minify')({}, { comments: false }),
        require('poi-preset-typescript')(),
        require('poi-preset-karma')({
            port: 5001, // default
            files: ['test/unit/*.ts'] // default,
        })
    ],
    extendWebpack(config) {
        // enable to see the bundle structure
        // config.plugin('bundleAnalyzer').use(BundleAnalyzerPlugin);

        // add a loader for csv translation files
        config.module
            .rule('lint')
            .test(/\.csv$/)
            .use('eslint')
            .loader('dsv-loader');
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
