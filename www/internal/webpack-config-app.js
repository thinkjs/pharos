const webpack = require('webpack');
const webpackConfigFactory = require('./webpack-config-factory');
const appRootDir = require('app-root-dir').get();
const path = require('path');
const outputPath = path.resolve(appRootDir, 'public/client');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack')
const options = require('./options');

console.log('运行配置：\n' + Object.keys(options).map(key => `${key}: ${options[key]}`).join('\n'));
const {
  env
} = options;
const isDev = process.env.NODE_ENV === 'development';

var htmlEntries = [{
  template: './src/index.html',
  filename: 'index.html',
}].map(v => {
  return new HtmlWebpackPlugin({
    template: path.join(appRootDir, v.template),
    filename: v.filename,
  })
})
const plugins = [
  ...htmlEntries,
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
  isDev && new webpack.NoEmitOnErrorsPlugin(),
  !isDev && new webpack.HashedModuleIdsPlugin(),
].filter(i => !!i);

const clientConfig = Object.assign(webpackConfigFactory(options), {
  entry: ['@babel/polyfill', './src/index.tsx'],
  output: {
    path: path.join(__dirname, '../static'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  target: 'web',
  devServer: {
    contentBase: './static', // Content base
    inline: true, // Enable watch and live reload
    host: '127.0.0.1',
    port: 8080,
    stats: 'errors-only',
    historyApiFallback: true,
    disableHostCheck: true
  },
});
clientConfig.plugins.unshift(...plugins);
const importPlugin = ["import", {
  "libraryName": "antd",
  "libraryDirectory": "lib",
  "style": false
}] // `style: true` for less;
clientConfig.module.rules.unshift({
  test: /\.m?jsx?$/,
  type: "javascript/auto",
  use: [{
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/react',
        ['@babel/preset-env']
      ],
      plugins: [
        "@babel/plugin-syntax-dynamic-import",
        '@babel/plugin-proposal-class-properties',
        importPlugin,
      ]
    }
  },
  {
    loader: 'eslint-loader'
  },
  ],

  exclude: path.resolve(appRootDir, 'node_modules'),
  // include: path.resolve(appRootDir, 'src')
})

module.exports = clientConfig;
