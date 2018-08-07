const path = require("path");

const BUILD_DIR = path.resolve(__dirname, "build");

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
				test: /\.tsx?/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					presets: ["@babel/react", "@babel/env", "@babel/typescript"],
					plugins: ["@babel/proposal-class-properties"]
				}
			}
		]
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx"]
	},
	devServer: {
		contentBase: "./",
		port: 5000,
		historyApiFallback: true
	}	
};
