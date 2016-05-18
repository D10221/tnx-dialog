// WARNING: Path relative to parent folder !
module.exports = {
    entry: './test/tests.ts',
    output: {
        filename: 'built/tests.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    ts:{
        compilerOptions:{
            "outDir": "built"
        }
    }
};
