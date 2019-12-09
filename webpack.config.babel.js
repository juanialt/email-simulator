import path from "path";
import { LoaderOptionsPlugin, DefinePlugin } from "webpack";
import CleanWebpackPlugin from "clean-webpack-plugin";
import WriteFilePlugin from "write-file-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

module.exports = {
  entry: ["@babel/polyfill", path.resolve(__dirname, "./app/index.js")],

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
    publicPath: "./public"
  },

  devServer: {
    publicPath: "./public",
    contentBase: "./public",
    historyApiFallback: true,
    port: 8080
  },

  devtool: "#source-map",

  resolve: {
    extensions: [".js", ".jsx"]
  },

  plugins: [
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      )
    }),
    new CleanWebpackPlugin(["public"], {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    new WriteFilePlugin(),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, "index.html") },
      { from: path.resolve(__dirname, "./app/images/favicon.ico") },
      { from: path.resolve(__dirname, "./app/images/favicon.png") },
      { from: path.resolve(__dirname, "./app/images/files"), to: "./images/" }
    ]),
    new LoaderOptionsPlugin({ options: {} })
  ],

  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js[x]?$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      },
      {
        test: /\.js[x]?$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: "[local]_[hash:base64:5]"
            }
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: "10000",
              name: "[name].[ext]?[hash]",
              publicPath: "/",
              outputPath: "images/"
            }
          }
        ]
      }
    ]
  }
};
