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
        test: /\.css$/,
        loader: "style-loader!css-loader?modules&importLoaders=1&localIdentName=[local]_[hash:base64:5]"
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
	}	
};
