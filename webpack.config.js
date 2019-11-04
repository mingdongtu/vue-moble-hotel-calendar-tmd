const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  devtool: false,
  entry: "./src/index.js",//入口文件，就是上步骤的src目录下的index.js文件，
  output: {
    path: path.resolve(__dirname, './'),//输出路径，就是上步骤中新建的dist目录，
    publicPath: '/',
    filename: 'index.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'inline-source-map',
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      test: /\.styl$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        { loader: "stylus-loader" }
      ]
    },
    {
      test: /\.js$/,
      exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
      loader: 'babel-loader',
    },
    {
      test: /\.(png|jpg|gif|ttf|svg|woff|eot)$/,
      loader: 'url-loader',
      query: {
        limit: 30000,
        name: '[name].[ext]?[hash]'
      }
    }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new UglifyJsPlugin()
  ]
};
