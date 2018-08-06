const webpack = require("../Library/Caches/typescript/2.9/node_modules/@types/webpack");
const merge = require("../Library/Caches/typescript/2.9/node_modules/@types/webpack-merge");
// const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const common = require("./webpack.common");

module.exports = merge(common, {
    mode: "production",
    plugins: [
        // new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]
});
