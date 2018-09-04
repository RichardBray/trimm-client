const path = require("path");
const BUILD_DIR = path.resolve(__dirname, "build");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';
const cssModules = devMode && "[local]_";


module.exports = {
	target: "web",
	entry: "./src/index.tsx",
	output: {
		path: BUILD_DIR,
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					`css-loader?modules&importLoaders=1&localIdentName=${cssModules}[hash:base64:3]`
				]
			},			
			{
				test: /\.(jpg|png|gif|svg)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]"
						}
					}
				]				
			},			
			{
				test: /\.tsx?/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					presets: ["@babel/react", "@babel/env", "@babel/typescript"],
					plugins: [
						"@babel/proposal-class-properties", 
						"@babel/transform-runtime"]
				}
			}
		]
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".css"],
    alias: {
        ["~"]: path.resolve(__dirname)
    }		
	},
	devServer: {
		contentBase: "./",
		port: 5000,
		historyApiFallback: true
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		})		
	]	
};
