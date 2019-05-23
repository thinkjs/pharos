const merge = require('webpack-merge');
const commonConfig = require('./config.common');
const webpack = require('webpack');

const prodConfig = merge(commonConfig, {
  mode: 'production',
  plugins: [
    new webpack.HashedModuleIdsPlugin()
  ]
})

module.exports = prodConfig