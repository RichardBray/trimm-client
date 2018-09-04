const webpack = require("webpack");
const merge = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const common = require("./webpack.common");


module.exports = merge(common, {
	mode: "production",	
	plugins: [
		new OptimizeCSSAssetsPlugin(),
		new UglifyJSPlugin({
			cache: true,
			parallel: true
		}),		
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify("production")
		})
	]
});
