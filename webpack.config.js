const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PATHS = {
  src: path.resolve(__dirname, "src"),
  dist: path.resolve(__dirname, "docs"),
  contentBase: path.resolve(__dirname, "public"),
};

module.exports = (env = { NODE_ENV: "production" }) => {
  const isDev = env.NODE_ENV === "development";
  return {
    mode: isDev ? "development" : "production",
    entry: {
      app: path.join(PATHS.src, "index.js"),
    },
    output: {
      filename: "[name].js",
      path: PATHS.dist,
      publicPath: isDev ? "/" : "./",
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "LEMU Design System",
        minify: !isDev,
        template: path.join(PATHS.contentBase, "index.html"),
      }),
    ],
  };
};
