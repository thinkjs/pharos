const merge = require('webpack-merge');
const commonConfig = require('./config.common');
console.log(222, commonConfig)
const webpack = require('webpack');

const devConfig = merge(commonConfig, {
  mode: 'development',
  devServer: {
    contentBase: './static', // Content base
    inline: true, // Enable watch and live reload
    host: '127.0.0.1',
    port: 8080,
    stats: 'errors-only',
    historyApiFallback: true,
    disableHostCheck: true
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ]
})
module.exports = devConfig