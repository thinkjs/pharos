const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const appConfig = require('./webpack-config-app')

var configs = [appConfig];
configs.forEach((config, i) => {
  config.plugins.push(new BundleAnalyzerPlugin({
    analyzerPort: 7330 + i
  }));
});

function report(err, stats) {
  if (err || stats.hasErrors()) {
    console.error(err);
  }
  console.log(stats.toString({
    colors: true,
    cached: false,
    children: true,
    chunkModules: false,
    chunkOrigins: false,
    modules: false
  }))
}
webpack(appConfig, report);
