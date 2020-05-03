const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    externals: {
        'vuex': 'Vuex',
        'vue': 'Vue',
    },
    stats: {
        children: false,
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    'vue-loader',
                ]
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',

            },
            {
                test: /.scss$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader!sass-loader'
                })
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.vue', '.js'],
    },
    output: {
        filename: 'keyboard.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new ExtractTextPlugin('keyboard.css'),
    ]
};
