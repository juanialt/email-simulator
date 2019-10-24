import path from "path";
import { DefinePlugin, LoaderOptionsPlugin } from "webpack";
import WriteFilePlugin from "write-file-webpack-plugin";
import CleanWebpackPlugin from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import { assign } from "lodash/fp";
import config from "./webpack.config.babel";

export default assign(config, {
  plugins: [
    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new CleanWebpackPlugin(["public"], {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    new WriteFilePlugin(),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, "index.html")
    }]),
    new LoaderOptionsPlugin({ options: {} })
  ],
  devtool: false,
  optimization: {
    minimizer: [new TerserPlugin()]
  }
});
