const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    popup: path.join(__dirname, './src/popup.ts'),
    background: path.join(__dirname, './src/background.ts'),
    'content-script': path.join(__dirname, './src/content-script.ts'),
  },
  output: {
    path: path.join(__dirname, './dist/js'),
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
};
