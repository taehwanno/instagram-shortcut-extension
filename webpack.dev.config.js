const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.config.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  entry: {
    popup: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      path.join(__dirname, './src/popup.ts'),
    ],
    background: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      path.join(__dirname, './src/background.ts'),
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    disableHostCheck: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    hot: true,
  },
  plugins: [new HotModuleReplacementPlugin()],
});
