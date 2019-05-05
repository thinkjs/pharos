
const appRootDir = require('app-root-dir').get();

function PrependContentPreprocessor(options) {
  this.options = options || {};
};
PrependContentPreprocessor.prototype = {
  process: function (css, e) {
    var path = e.imports.rootFilename.replace(appRootDir, '').replace('\\', '\/')
    if (path.indexOf('/node_modules/') >= 0) {
      return css;
    }
    if (path.indexOf('/app/system/') >= 0 || path.indexOf('/app/admin/') >= 0) {
      return `@import '~common/style/theme.less';\n${css.replace(`@import '~common/style/theme.less'`, '')}`
    } else {
      return `@import '~common/style/theme-user.less';\n${css.replace(`@import '~common/style/theme-user.less'`, '')}`
    }
  }
};

function LessPluginAutoPrefixer(options) {
  this.options = options;
};

LessPluginAutoPrefixer.prototype = {
  install: function (less, pluginManager) {
    pluginManager.addPreProcessor(new PrependContentPreprocessor(this.options));
  },
  minVersion: [2, 0, 0]
};

module.exports = LessPluginAutoPrefixer;
