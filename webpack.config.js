module.exports = {
    entry: "./src/tnx-dialog.ts",
    output: {
        path: __dirname,
        filename: "dist/tnx-dialog.js",
        library: "tnx-dialog",
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    // Source maps support ('inline-source-map' also works)
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    ts:{
        configFileName: './tsconfig.json'
    }
};

