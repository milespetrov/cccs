const ConcatSource = require('webpack-sources').ConcatSource;

const timestamp = {};

function version_plugin() {
    const date = new Date();
    timestamp.month = ('0' + (date.getMonth() + 1)).slice(-2);
    timestamp.year = date.getFullYear();
    timestamp.day = ('0' + date.getDate()).slice(-2);
}

version_plugin.prototype.apply = function(compiler) {
    compiler.plugin('compilation', compilation => {
        compilation.plugin('optimize-chunk-assets', (chunks, done) => {
            chunks.forEach(chunk => {
                chunk.files.forEach(filename => {
                    if (/^cccs-sandbox(\.min)?\.js$/.test(filename)) {
                        const content = `var PageTimestamp = "${timestamp.year}-${timestamp.month}-${timestamp.day}";`;
                        compilation.assets[filename] = new ConcatSource(content, compilation.assets[filename]);
                    }
                });
            });
            done();
        });
    });
};

module.exports = version_plugin;
