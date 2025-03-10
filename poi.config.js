const VersionPlugin = require("./assets/webpack/version_plugin.js");
const jsonminify = require("jsonminify");
const htmlminify = require("html-minifier").minify;
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { exec } = require("child_process");

module.exports = {
    output: {
        dir: "dist",
        fileNames: {
            js: ".min.js",
            css: "[name].min.css"
        },
        publicUrl: "./"
    },
    css: {
        extract: true,
        loaderOptions: {
            sass: {
                implementation: require("sass"),
                sassOptions: {
                    includePaths: [path.resolve(__dirname, "src/styles")],
                    outputStyle: process.env.NODE_ENV === "production" ? "compressed" : "expanded"
                }
            }
        }
    },
    devServer: {
        port: 3001,
        open: false,
        before(app, server) {
            exec("start http://localhost:3001/climate-maps.html");
        },
        historyApiFallback: {
            index: "/climate-maps.html", // Serve this as the default page
            disableDotRule: true,
            rewrites: [{ from: /./, to: "/pages/404.html" }]
        }
    },
    chainWebpack(config) {
        config.plugin("versionPlugin").use(VersionPlugin);

        config.module
            .rule("csv")
            .test(/\.csv$/)
            .use("dsv-loader")
            .loader("dsv-loader")
            .end();

        config.optimization.splitChunks(false);
        config.optimization.runtimeChunk(false);
        config.optimization.concatenateModules(true);

        config.output.filename("[name].min.js").end();

        config.plugin("copy-assets").use(CopyPlugin, [
            {
                patterns: [
                    {
                        from: path.resolve(__dirname, "static"),
                        to: path.resolve(__dirname, "dist")
                    },
                    {
                        from: path.resolve(__dirname, "assets"),
                        to: path.resolve(__dirname, "dist/assets"),
                        transform(content, path) {
                            // minify files only for a production build
                            if (process.env.NODE_ENV !== "production") {
                                return content;
                            }

                            // minify .json files
                            if (/\.json$/gi.test(path)) {
                                return jsonminify(content.toString());
                            }

                            // minify .html files
                            if (/\.html$/gi.test(path)) {
                                return htmlminify(content.toString(), { collapseWhitespace: true, minifyCSS: true });
                            }

                            return content;
                        }
                    }
                ]
            }
        ]);

        // Disable TypeScript type checking to save memory
        if (config.plugins.has("fork-ts-checker")) {
            config.plugins.delete("fork-ts-checker");
        }
    },
    pages: {
        "climate-maps": {
            entry: "src/index.ts",
            template: "src/index.en.ejs",
            filename: "climate-maps.html"
        },
        "cartes-climatiques": {
            entry: "src/index.ts",
            template: "src/index.fr.ejs",
            filename: "cartes-climatiques.html"
        }
    },
    plugins: [
        {
            resolve: "@poi/plugin-typescript"
        }
    ]
};
