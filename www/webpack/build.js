const webpack = require("webpack");
const options = require("./options");

// 删除上次编译结果
require("./clean");

function report(err, stats) {
  if (err) {
    return console.error(err);
  }
  console.log(
    stats.toString({
      colors: true,
      cached: false,
      children: true,
      chunkModules: false,
      chunkOrigins: false,
      modules: false
    })
  );
}

const webpackEntryMap = {
  development: "./config.dev",
  test: "./config.dev",
  beta: "./config.production",
  production: "./config.production"
};
webpack(require(webpackEntryMap[options.env]), report);
