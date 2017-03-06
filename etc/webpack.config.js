/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const webpack = require('webpack');
const url = require('url');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('inferno-dev-utils/InterpolateHtmlPlugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const paths = require('./paths');

// Get environment variables to inject into our app.
var env = process.env;

if (env.NODE_ENV !== 'production')
  throw new Error('Production builds must have NODE_ENV=production. (NODE_ENV="' + env.NODE_ENV + '")');


/* -------- Common pieces -------- */
const autoprefixer = { 
  loader: 'postcss-loader',
  options: {
    plugins: () => {
      return [
        require('autoprefixer')({
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9', // Inferno doesn't support IE8 anyway
          ],
        }),
      ];
    },
  }
};


webpackConfig = {
  // Don't attempt to continue if there are any errors.
  bail: true,

  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: 'source-map',

  context: __dirname,
  // In production, we only want to load the polyfills and the app code.

  entry: {
    //    require.resolve('./polyfills'),
    main: paths.appIndexJs,
  },

  output: {
    // The build folder.
    path: paths.appBuild,
    filename: paths.asset('js/[name].[chunkhash:8].js'),
    chunkFilename: paths.asset('static/js/[name].[chunkhash:8].chunk.js'),
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: paths.publicPath,
  },

  module: {
    rules: [
      //====> ESLint JS check first of all
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        include: [ paths.appSrc ],
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          useEslintrc: false,
          cache: true,
          failOnError: true,
          configFile: "inferno-app"
        },
      },
  
      // Default loader: load all assets that are not handled by other loaders with the url loader.
      // Note: This list needs to be updated with every change of extensions the other loaders match.
      // E.g., when adding a loader for a new supported file extension,
      // we need to add the supported extension to this loader too.
      // Add one new line in `exclude` for each loader.
      //
      // "file" loader makes sure those assets end up in the `build` folder.
      // When you `import` an asset, you get its filename.
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        exclude: [
          /\.html$/,
          /\.[jt]sx?$/,
          /\.css$/,
          /\.styl$/,
          /\.json$/,
          /\.svg$/
        ],
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: paths.asset('media/[name].[hash:8].[ext]'),
        }
      },
  
      //====> Babel JSX
      {
        test: /\.jsx?$/,
        include: [ paths.appSrc ],
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [require.resolve('babel-preset-inferno-app')],
          cacheDirectory: true,
        },
      },

      //====> Extract CSS
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: (env.WEBPACK_BUILD !== 'debug'),
              },
            },

            autoprefixer,
          ],
          fallback: "style-loader",
        }),
      },

      //====> Extract STYLUS CSS
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                minimize: (env.WEBPACK_BUILD !== 'debug'),
              },
            },

            autoprefixer,

            { loader: 'stylus-loader' },
          ],
          fallback: "style-loader",
        }),
      },
    ]
  },

  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: [".js", ".json", ".css", ".styl"],
  },

  plugins: [
    // Get process environment accessible from app
    //  new webpack.DefinePlugin(process.env),
    //  new webpack.EnvironmentPlugin([ "NODE_ENV" ]),

    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),

    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),

    new InterpolateHtmlPlugin({
      PUBLIC_URL: '/',
    }),

    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new ExtractTextPlugin(paths.asset('css/[name].[contenthash:8].css')),

    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: env.WEBPACK_BUILD !== 'debug' ? {
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
      } : false,
    })
  ],

  devServer: {
    hot: true,
    compress: true,
    https: true,
    inline: true,
    quiet: true,
    clientLogLevel: 'info',
    contentBase: paths.appPublic,
    publicPath: paths.publicPath,
    historyApiFallback: {
      index: paths.publicPath,
    },
    watchOptions: {
      ignored: /node_modules/
    },
    stats: { colors: true },
  },
};

// Minify the code.
if (env.WEBPACK_BUILD !== 'debug')
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        screw_ie8: true, // Inferno doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      },
    })
  );


module.exports = webpackConfig;

