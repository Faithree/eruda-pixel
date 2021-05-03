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
        port: 4000
    },
    output: {
        path: __dirname,
        filename: 'eruda-pixel.js',
        publicPath: '/assets/',
        library: ['erudaPixel'],
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-runtime']
                    }
                }
            },
            {
                test: /\.scss$/,
                loaders: [
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function() {
                                return [
                                    postcss.plugin(
                                        'postcss-namespace',
                                        function() {
                                            // Add '.dev-tools .tools ' to every selector.
                                            return function(root) {
                                                root.walkRules(function(rule) {
                                                    if (!rule.selectors)
                                                        return rule;

                                                    rule.selectors = rule.selectors.map(
                                                        function(selector) {
                                                            return (
                                                                '.dev-tools .tools ' +
                                                                selector
                                                            );
                                                        }
                                                    );
                                                });
                                            };
                                        }
                                    ),
                                    classPrefix('eruda-'),
                                    autoprefixer
                                ];
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader'
            }
        ]
    },
    plugins: [new webpack.BannerPlugin(banner)]
};
