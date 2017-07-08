
const path = require('path');
const webpack = require('webpack');

const PRODUCTION = process.argv.includes('-p');
const VERBOSE = process.argv.includes('--verbose');

const SCRIPTS_ROOT = path.resolve(__dirname, 'src');
const env = PRODUCTION ? 'production' : 'development';

module.exports = {
  entry: {
    index: path.join(SCRIPTS_ROOT, '/intent-dispatch/application/index.js'),
  },
  output: {
    publicPath: '/web',
    sourcePrefix: '  ',

    path: path.join(SCRIPTS_ROOT, '/intent-dispatch/application/web'),
    filename: PRODUCTION ? '[name].js' : '[name].js?[hash]',
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: !PRODUCTION,
    }),

    new webpack.ProvidePlugin({
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${env}"`,
      '__DEV__': !PRODUCTION,
    }),
    ...(PRODUCTION ? [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
    ] : []),
  ],

  cache: !PRODUCTION,

  watchOptions: {
    aggregateTimeout: 200,
    ignored: /node_modules/,
  },

  stats: {
    colors: true,
    reasons: !PRODUCTION,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },


  resolve: {
    modules   : [SCRIPTS_ROOT, 'node_modules'],
    extensions: ['.js', '.json'],
    alias: {
      'react': 'react-lite',
      'react-dom': 'react-lite',
    },
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.txt$/,
        loader: 'raw',
      },
    ],
  },

};
