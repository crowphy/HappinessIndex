const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
            new webpack.optimize.UglifyJsPlugin({
                comments: false,        //去掉注释
                compress: {
                    warnings: false    //忽略警告,要不然会有一大堆的黄色字体出现……
                }
            }),
            new ExtractTextPlugin('[name].[contenthash].css')
        ],
    }
}
