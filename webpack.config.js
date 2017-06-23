const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const jsRules = {
   test: /\.js$/,
   exclude: /node_modules/,
   use: [
      {
         loader: 'babel-loader',
         options: { presets: ['es2015'] }
      }
   ]
};

const devUrlRules = {
  test: /\.(woff|woff2|svg)(\?[a-z0-9=&.]+)?$/,
  use: [
     {
        loader: 'url-loader'
     }
  ]
};

const devStyleRules = {
   test: /\.scss$/,
   include: path.join(__dirname, 'src'),
   loaders: ['style-loader', 'css-loader?sourceMap', 'postcss-loader', 'sass-loader?sourceMap'],
};



let config = {
   entry: path.join(__dirname, './src/index.js'),
   output: {
      filename: 'bundle.js',
      path: path.join(__dirname, 'dist'),
      publicPath: './'
   },
   devServer: {
      compress: true,
      inline: true,
      port: 3000
   },
   module: {
      rules: [
         jsRules,
         devUrlRules,
         devStyleRules
      ]
   },
  devtool: 'source-map'
};

if (process.env.NODE_ENV === 'production') {
   config = Object.assign(config, {
      plugins: [
         new HtmlWebpackPlugin({
            inject: true,
            template: path.join(__dirname, './index.html'),
            minify: {
               removeComments: true,
               collapseWhitespace: true,
               removeRedundantAttributes: true,
               useShortDoctype: true,
               removeEmptyAttributes: true,
               removeStyleLinkTypeAttributes: true,
               keepClosingSlash: true,
               minifyJS: true,
               minifyCSS: true,
               minifyURLs: true
            }
         }),
         new webpack.DefinePlugin({
            'process.env': {
               NODE_ENV: JSON.stringify('production')
            }
         }),
         new webpack.optimize.UglifyJsPlugin({
            compress: {
               warnings: false,
               comparisons: false
            },
            output: {
               comments: false,
            },
            sourceMap: true
         }),
         new ExtractTextPlugin({
            filename: '[name].[contenthash:8].css'
         })
      ],
      module: {
         rules: [
            jsRules,
            {
              test: /\.(woff|woff2|svg)(\?[a-z0-9=&.]+)?$/,
              use: [
                 {
                    loader: 'url-loader',
                    options: {
                       publicPath: '../'
                    }
                 }
              ]
            },
            {
               test: /\.scss$/,
               include: path.join(__dirname, './src'),
               loader: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: [
                     {
                        loader: 'css-loader',
                        options: {
                           sourceMap: true,
                           minimize: true,
                           importLoaders: 1
                        }
                     },
                     {
                        loader: 'sass-loader',
                        options: {
                           sourceMap: true
                        }
                     },
                     'postcss-loader'
                  ]
               })
            }
         ]
      }
   });
}

module.exports = config;
