// const path = require("path");
// const CopyPlugin = require("copy-webpack-plugin");
// const EncodingPlugin = require("webpack-encoding-plugin");
// module.exports = {
//   entry: {
//     bundle: "./src/index.jsx",
//     content: "./src/content.js"
//   },
//   output: {
//     filename: "[name].js",
//     path: path.resolve(__dirname, "dist"),
//   },
//   module: {
//     rules: [
//       {
//         test: /\.jsx?$/,
//         use: "babel-loader",
//         exclude: /node_modules/
//       },
//       {
//         test: /\.css$/,
//         use: ["style-loader", "css-loader", "postcss-loader"],
//       }
//     ]
//   },
//   resolve: {
//     extensions: [".js", ".jsx"]
//   },
//   plugins: [
//     new CopyPlugin({
//       patterns: [
//         { from: "manifest.json", to: "." },
//         {from: "src/dashboard.js", to: "."}
//       ]
//     }),
//      new EncodingPlugin({
//       encoding: "utf-8-bom"
//     })
//   ],
//   mode: "production"
// };

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

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
        use: ["style-loader", "css-loader", "postcss-loader"],
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
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "." },
        { from: "src/background.js", to: "."}
      ]
    })
  ],
  mode: "production"
};

