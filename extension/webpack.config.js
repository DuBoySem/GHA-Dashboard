const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        bundle: "./src/index.jsx",
        content: "./src/content.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: "babel-loader",
                include: [
                    path.resolve(__dirname, "src"),
                    // include the dashboard folder
                    path.resolve(__dirname, "dashboard/src")
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
                include: [
                    path.resolve(__dirname, "dashboard/src"),
                    path.resolve(__dirname, "src")
                ]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new CopyPlugin({
            patterns: [
                {from: "manifest.json", to: "."},
                {from: "src/background.js", to: "."},
                {from: "src/popup.html", to: "."},
                {from: "src/popup.js", to: "."}
            ]
        })
    ],
    mode: "production"
};

