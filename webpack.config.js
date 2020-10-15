const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
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
      filename: "[name].js",
      path: PATHS.dist,
      publicPath: isDev ? "/" : "./",
    },
    devServer: {
      contentBase: PATHS.contentBase,
      watchContentBase: true,
      open: true,
    },
    devtool: isDev ? "cheap-source-map" : "source-map",
    plugins: [
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
