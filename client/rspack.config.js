const path = require("node:path");
const { HtmlRspackPlugin } = require("@rspack/core");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/[name].js",
    publicPath: "/",
    clean: true
  },
  devtool: "source-map",
  devServer: {
    host: "0.0.0.0",
    port: 3100
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: false
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlRspackPlugin({
      template: "./src/index.html",
      filename: "index.html"
    })
  ]
};
