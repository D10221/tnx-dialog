//require('tnx-core');

//WARNING: relative to project root
module.exports = {
    entry: './example/example.ts',
    output: {
        filename: './built/example.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};
