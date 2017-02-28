const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        index: path.resolve(__dirname, 'index.js'),
        //vendors:['Network']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'ciscoVis.js',
        sourceMapFilename: 'ciscoVis.js.map',
        library: 'CiscoVis',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /node_modules[\\\/]vis[\\\/].*\.js$/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ["es2015"],
                    plugins: [
                        "transform-es3-property-literals",
                        "transform-es3-member-expression-literals",
                        "transform-runtime"
                    ]
                }
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.join(__dirname, 'lib'),
                query: {
                    presets: ["es2015", "stage-0"],
                }
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=img/[hash].[ext]',
            }, {
                test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
                loader: 'file-loader?name=fonts/[name].[md5:hash:hex:7].[ext]',
            },
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            // output: {//!!!
            //     ascii_only: true,
            //     quote_keys: true,
            // }
        }),
        //new webpack.optimize.CommonsChunkPlugin('vendors')
    ]
}