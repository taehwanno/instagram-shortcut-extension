const path = require('path');
const { EnvironmentPlugin } = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    popup: path.join(__dirname, './src/popup.ts'),
    background: path.join(__dirname, './src/background.ts'),
    'content-script': path.join(__dirname, './src/content-script.ts'),
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CleanPlugin(['dist']),
    new EnvironmentPlugin(['NODE_ENV']),
    new CopyPlugin([{ context: path.join(__dirname, 'public'), from: '**/*' }]),
    new HtmlPlugin({
      template: path.join(__dirname, './src/html', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlPlugin({
      template: path.join(__dirname, './src/html', 'options.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
    new HtmlPlugin({
      template: path.join(__dirname, './src/html', 'background.html'),
      filename: 'background.html',
      chunks: ['background'],
    }),
    new WriteFilePlugin(),
  ],
};
