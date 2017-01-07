var webpack = require('webpack');

module.exports = function(env) {
    return {
        entry: {
            main: __dirname + '/src/app.js',
        },
        output: {
            path: __dirname + '/dist',
            filename: "[name].js",
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015', 'react']
                    }
                }
            ]
        },

        plugins: [
            // new webpack.optimize.CommonsChunkPlugin({
            //     filename: '[name].js',
            //     names: ['vendor'],
            //     minChunks: 2
            // }),
            new webpack.DefinePlugin({
                'process.env': {NODE_ENV:  JSON.stringify("production")}
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DllReferencePlugin({
                manifest: require('./manifest.json'),
                context: __dirname,
            }),
        ],
        devServer: {
            contentBase: __dirname + '/dist',
            inline: true,
            historyApiFallback: true,
            colors: true
        }
    }
}
