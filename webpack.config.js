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
    // alias: {
    //   '@common-lib-for-slack': path.resolve(
    //     __dirname,
    //     '../common-lib-for-slack'
    //   ),
    // },
    plugins: [new TsconfigPathsPlugin({})],
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        exclude: /node_modules/,
        loader: 'babel-loader', // プロジェクト参照の場合は、ts-loader はうまく動かなかった
        include: [
          __dirname,
          path.resolve(__dirname, '../common-lib-for-slack/dist'),
        ],
      },
    ],
  },
  plugins: [new GasPlugin(), new NodePolyfillPlugin()],
};
