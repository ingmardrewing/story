const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  devtool: "source-map",
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
};
