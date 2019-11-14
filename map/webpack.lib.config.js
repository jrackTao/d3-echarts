/**
 * cnpm i clean-webpack-plugin webpack-manifest-plugin webpack-bundle-analyzer --save-dev
 */

const CleanWebpackPlugin = require('clean-webpack-plugin');

/** 可视化bundle大小 target:#0A */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const glob = require('glob');
const path = require('path');
const base = require('./webpack.config');

function resolve(dir) {
  return path.resolve(__dirname, '.', dir);
}

const files = new glob.Glob('./src/components/*/index.js', {nonull: true, matchBase: true, sync: true}).found;
const entrys = {};

files.forEach(file => {
  const regResult = /components\/(\S*)\/index.js/.exec(file);
  regResult && (entrys[regResult[1]] = file);
});

module.exports = {
  ...base,
  target: 'node',
  // entry: {
  //   index: resolve('src/index.js')
  // },
  entry: entrys,
  externals: [
    'react', 'prop-types'
  ],
  plugins: [
    new CleanWebpackPlugin(),
    /** #0A 可视化bundle大小 */
    // new BundleAnalyzerPlugin()
  ],
  mode: 'production',
};
