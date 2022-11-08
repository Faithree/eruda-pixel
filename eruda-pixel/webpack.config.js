const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const webpack = require('webpack');
const pkg = require('./package.json');
const classPrefix = require('postcss-class-prefix');

const banner = pkg.name + ' v' + pkg.version + ' ' + pkg.homepage;

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  devServer: {
    contentBase: './',
    port: 30010,
  },
  output: {
    path: __dirname,
    filename: 'eruda-pixel.js',
    publicPath: '/assets/',
    library: ['erudaPixel'],
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.txt$/,
        use: ['raw-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['transform-runtime'],
          },
        },
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
    ],
  },
  plugins: [new webpack.BannerPlugin(banner)],
};
