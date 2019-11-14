/**
 * cnpm i clean-webpack-plugin webpack-manifest-plugin webpack-parallel-uglify-plugin webpack-bundle-analyzer --save-dev
 */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const base = require('./webpack.config');

module.exports = {
  ...base,
  entry: [
    path.resolve(__dirname, 'src/samples/index.js')
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Demo',
      template: path.resolve(__dirname, 'src/samples/index.html')
    })
  ],
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'dist'),
    hot: true
  },
};
