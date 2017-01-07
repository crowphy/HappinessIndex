const webpack = require('webpack');

const vendors = [
    'react',
    'react-dom',
    'antd'
]

module.exports = function() {
    return {
        entry: {
            vendor: vendors
        },
        output: {
            path: __dirname + '/dist',
            filename: '[name].js',
            library: '[name]',
        },
        plugins: [
            new webpack.DllPlugin({
                path: 'manifest.json',
                name: '[name]',
                context: __dirname,
            }),
        ],
    }
}
