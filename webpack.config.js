
const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');

const PRODUCTION = process.argv.includes('-p');
const VERBOSE = process.argv.includes('--verbose');

const SCRIPTS_ROOT = path.resolve(__dirname, 'src');
const env = PRODUCTION ? 'production' : 'development';

module.exports = {
	entry: {
		// intent: './build/bin/intent.js',
	},
	output: {
		publicPath: '/',
		sourcePrefix: '  ',

		path: SCRIPTS_ROOT,
		filename: PRODUCTION ? '[name].js' : '[name].js?[hash]',
	},

	plugins: [
		new webpack.LoaderOptionsPlugin({
			debug: !PRODUCTION,
		}),

		new webpack.ProvidePlugin({
		}),
		new webpack.DefinePlugin({
			// '__APP_CONFIG__': JSON.stringify(_.merge({}, require('./config/base'), require(`./config/${env}`))),
			'process.env.NODE_ENV': `"${env}"`,
			'__DEV__': !PRODUCTION,
		}),
		// new webpack.optimize.CommonsChunkPlugin({
		// 	name: "commons",
		// 	filename: "commons.js",
		// }),
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
