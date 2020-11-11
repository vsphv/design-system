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
  public: path.resolve(__dirname, "public"),
};

const env = process.env.NODE_ENV;

module.exports = () => {
  console.info(`Webpack running in ${env} mode.`);
  const ENV_CONFIG = {
    common: {
      entry: {
        main: path.join(PATHS.src, "index.js"),
      },
      output: {
        filename: "scripts/[name].js",
        path: PATHS.dist,
      },
      resolve: {
        alias: {
          sass: PATHS.sass,
          "react-dom": "@hot-loader/react-dom",
        },
        extensions: [".js", ".jsx", ".css", ".scss"],
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            include: PATHS.src,
            use: [
              {
                loader: "babel-loader",
                options: {
                  exclude: [/node_modules\/(webpack|html-webpack-plugin)\//],
                  cacheDirectory: true,
                },
              },
            ],
          },
        ],
      },
      plugins: [
        new webpack.ProgressPlugin({ percentBy: "entries" }),
        new HtmlWebpackPlugin({
          title: "Design System",
          template: path.join(PATHS.public, "index.html"),
        }),
      ],
      devtool: false,
    },
    development: {
      mode: "development",
      target: "web",
      entry: {
        main: ["react-hot-loader/patch", path.join(PATHS.src, "index.js")],
      },
      output: {
        publicPath: "/",
      },
      devServer: {
        contentBase: [PATHS.dist, PATHS.public],
        hot: true,
        open: true,
        host: "localhost",
        port: 8080,
      },
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
      plugins: [
        new webpack.EvalSourceMapDevToolPlugin({
          filename: "[name][ext].sourcemap",
        }),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new FriendlyErrorsWebpackPlugin(),
      ],
    },
    production: {
      mode: "production",
      bail: true,
      target: "browserslist",
      output: {
        publicPath: "./",
        chunkLoading: false,
        wasmLoading: false,
      },
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
        new CleanWebpackPlugin(),
        new webpack.SourceMapDevToolPlugin({
          filename: "[name][ext].sourcemap",
        }),
        new CopyPlugin({
          patterns: [
            {
              from: path.join(PATHS.public, "/fonts"),
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
        new MiniCssExtractPlugin({
          filename: "styles/[name].css",
          chunkFilename: "styles/[id].css",
        }),
      ],
    },
  };
  const config = merge(ENV_CONFIG.common, ENV_CONFIG[env] || {});
  return config;
};
