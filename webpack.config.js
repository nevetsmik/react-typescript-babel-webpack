const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const modeConfig = mode => require(`./build-utils/webpack.${mode}.js`)(mode);
const applyPresetConfig = require("./build-utils/loadPresets");

module.exports = ({ mode, presets } = { mode: "development", presets: [] }) => {
  return webpackMerge(
    {
      mode,
      entry: ["./src/index.tsx"],
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[hash].js",
        chunkFilename: "[name].lazy-chunk.js",
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
      },
      module: {
        rules: [{ test: /\.(ts|js)x?$/, loader: "babel-loader", exclude: /node_modules/ }],
      },
      plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          inject: false,
          hash: true,
          template: "./src/index.html",
          filename: "index.html",
        }),
        new webpack.ProgressPlugin(), // more output in the console for builds
      ],
    },
    modeConfig(mode),
    applyPresetConfig({ presets }),
  );
};
