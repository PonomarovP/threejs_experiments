var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var rootDir = path.resolve(__dirname, '..');
var projDir = rootDir + "/VR_with_balls/";

module.exports = {
    resolve: {
        alias: {
            objects: path.resolve(__dirname, 'src/objects'),
            node_modules: path.resolve(__dirname, '../node_modules/')
        },
        extensions: [".js"],
    },
    entry: {
        bundle: path.resolve(__dirname, './src/app.js')
    },
    output: {
        path: path.join(rootDir, 'dist'),
        filename: 'app.bundle.js'
    },
    plugins: [new HtmlWebpackPlugin()]
}


