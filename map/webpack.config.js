/**
 * cnpm i babel-loader style-loader css-loader node-sass sass-loader uglifyjs-webpack-plugin uglify-js --save-dev
 */

const pkg = require('./package.json');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

function resolve(dir) {
  return path.resolve(__dirname, '.', dir);
}

module.exports = {
  cache: true,

  entry: {
    index: resolve('src/index.js')
  },

  output: {
    path: resolve('dist'),
    filename: '[name].js',
    library: pkg.name, // string,
    // 导出库(exported library)的名称
    libraryTarget: 'umd', // 通用模块定义
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        minify(file, sourceMap) {
          const uglifyJsOptions = {};
          console.log(sourceMap);
          if (sourceMap) {
            uglifyJsOptions.sourceMap = {
              content: sourceMap
            };
          }

          return require('uglify-js').minify(file, uglifyJsOptions);
        }
      })
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [resolve('src')],
        use: [{
          loader: 'babel-loader',
          options: {cacheDirectory: true}
        }]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        include: [resolve('src')],
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'src': resolve('src')
    }
  },
};
