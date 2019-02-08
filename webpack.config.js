const path = require('path');
const { EnvironmentPlugin } = require('webpack');
const ChromeExtensionReloaderPlugin = require('webpack-chrome-extension-reloader');
const CleanPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
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
    isDevelopment &&
      new ChromeExtensionReloaderPlugin({
        port: 8080,
        reloadPage: true,
        entries: {
          contentScript: 'content-script',
          background: 'background',
        },
      }),
  ].filter(Boolean),
};

if (isDevelopment) {
  config.devtool = 'inline-source-map';
}

module.exports = config;
