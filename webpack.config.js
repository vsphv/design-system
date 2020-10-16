const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");

const PATHS = {
  src: path.resolve(__dirname, "src"),
  dist: path.resolve(__dirname, "docs"),
  contentBase: path.resolve(__dirname, "public"),
};

module.exports = (_env, argv = { mode: "production" }) => {
  const isDev = argv.mode === "development";
  return {
    entry: {
      app: path.join(PATHS.src, "index.js"),
    },
    output: {
      filename: "scripts/[name].js",
      path: PATHS.dist,
      publicPath: isDev ? "/" : "./",
      chunkLoading: false,
      wasmLoading: false,
    },
    devServer: {
      contentBase: PATHS.contentBase,
      watchContentBase: true,
      open: true,
      quiet: true,
    },
    devtool: isDev ? "cheap-source-map" : "source-map",
    module: {
      rules: [
        {
          test: /.(js|jsx|mjs)$/,
          loader: "babel-loader",
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "styles/[name].css",
        chunkFilename: "styles/[id].css",
      }),
      new ESLintPlugin({
        extensions: ["js", "jsx"],
        formatter: "codeframe",
      }),
      new StylelintPlugin({
        formatter: "codeframe",
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: "LEMU Design System",
        minify: !isDev,
        template: path.join(PATHS.contentBase, "index.html"),
      }),
    ],
  };
};
