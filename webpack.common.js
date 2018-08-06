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
                    presets: ["@babel/react", "@babel/env", "@babel/typescript"]
                }
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    }
};
