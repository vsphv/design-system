const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const { merge } = require("webpack-merge");
const StylelintPlugin = require("stylelint-webpack-plugin");

const PATHS = {
  src: path.resolve(__dirname, "src"),
  dist: path.resolve(__dirname, "docs"),
  sass: path.resolve(__dirname, "src/sass"),
  contentBase: path.resolve(__dirname, "public"),
};

module.exports = (_env, argv = { mode: "production" }) => {
  const isDev = argv.mode === "development";
  const ENV_CONFIG = {
    common: {
      entry: {
        app: path.join(PATHS.src, "index.js"),
      },
      output: {
        filename: "scripts/[name].js",
        path: PATHS.dist,
        chunkLoading: false,
        wasmLoading: false,
      },
      devServer: {
        contentBase: PATHS.contentBase,
        watchContentBase: true,
        hot: true,
        open: true,
        quiet: true,
      },
      resolve: {
        alias: {
          sass: PATHS.sass,
        },
      },
      module: {
        rules: [
          {
            test: /.(js|jsx|mjs)$/,
            loader: "babel-loader",
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
      plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
          title: "LEMU Design System",
          minify: !isDev,
          template: path.join(PATHS.contentBase, "index.html"),
        }),
      ],
    },
    development: {
      output: {
        publicPath: "/",
      },
      devtool: "cheap-source-map",
      module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              "style-loader",
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
      plugins: [new FriendlyErrorsWebpackPlugin()],
    },
    production: {
      output: {
        publicPath: "./",
      },
      devtool: "source-map",
      module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              MiniCssExtractPlugin.loader,
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
        new CopyPlugin({
          patterns: [
            {
              from: path.join(PATHS.contentBase, "/fonts"),
              to: path.join(PATHS.dist, "/fonts"),
            },
          ],
        }),
        new ESLintPlugin({
          extensions: ["js", "jsx"],
          formatter: "codeframe",
        }),
        new StylelintPlugin({
          formatter: "codeframe",
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
          filename: "styles/[name].css",
          chunkFilename: "styles/[id].css",
        }),
      ],
    },
  };
  const config = merge(ENV_CONFIG.common, ENV_CONFIG[argv.mode] || {});
  return config;
};
