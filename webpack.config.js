const path = require('path');
const GasPlugin = require('gas-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development', // production にすると動作しなくなる
  devtool: false,
  context: __dirname,
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    fallback: {
      fs: false,
      readline: false,
      perf_hooks: false,
      child_process: false,
      http2: false,
      net: false,
      tls: false,
      async_hooks: false,
      dgram: false,
      cluster: false,
      url: false,
      module: false,
    },
    plugins: [new TsconfigPathsPlugin({})],
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [new GasPlugin(), new NodePolyfillPlugin()],
};
