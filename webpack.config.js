const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
   entry: './src/index.js',
   output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
   },
   devServer: {
      compress: true,
      inline: true,
      port: 3000
   },
   module: {
     rules: [
       { test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader"
       },
       {
         test: /\.(woff|woff2|svg)(\?[a-z0-9=&.]+)?$/,
         loader: 'url-loader',
      },
      {
         test: /\.scss$/,
         include: path.join(__dirname, 'src'),
         loaders: ['style-loader', 'css-loader?sourceMap', 'postcss-loader', 'sass-loader?sourceMap'],
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
     new ExtractTextPlugin({
        filename: 'styles.css'
     })
 ]
};
