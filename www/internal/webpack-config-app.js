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
  NODE_ENV,
  autoUpdate,
  env
} = options;
const isDev = NODE_ENV === 'development';
var versionScript = '';
var fundebug = '';
var timestampVersion = Date.now().valueOf();
if (autoUpdate) {
  versionScript = `<script>window.__version__ = "${timestampVersion}";</script>`
}
if (env === 'production') {
  fundebug = `<script src="https://js.fundebug.cn/fundebug.1.7.3.min.js" apikey="203ffa25252a5e6b04ebf15abe612bea1b13b9a7d2ea8755838e148d984a26e9"></script>`
}
var htmlEntries = [{
  template: './src/template.html',
  filename: 'user.html',
  chunks: ['common', 'app-common', 'user']
}, {
  template: './src/template.html',
  filename: 'admin.html',
  chunks: ['common', 'app-common', 'admin']
}, {
  template: './src/template.html',
  filename: 'system.html',
  chunks: ['common', 'app-common', 'system']
}, {
  template: './src/template.html',
  filename: 'experiment.html',
  chunks: ['common', 'app-common', 'experiment']
}, {
  template: './src/template.html',
  filename: 'exam.html',
  chunks: ['common', 'app-common', 'exam']
}, {
  template: './src/template.html',
  filename: 'teacher.html',
  chunks: ['common', 'app-common', 'teacher']
}, {
  template: './src/invitation.html',
  filename: 'invitation.html',
  chunks: ['common', 'invitation']
}, {
  template: './src/order.html',
  filename: 'order.html',
  chunks: ['common', 'app-common', 'order']
}, {
  template: './src/template.html',
  filename: 'login.html',
  chunks: ['common', 'app-common', 'login']
}, {
  template: './src/vnc.html',
  filename: 'vnc.html',
  chunks: ['common', 'vnc']
}].map(v => {
  return new HtmlWebpackPlugin({
    template: path.join(appRootDir, v.template),
    filename: v.filename,
    fundebug,
    versionScript,
    chunks: v.chunks
  })
})
const plugins = [
  ...htmlEntries,
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
  isDev && new webpack.NoEmitOnErrorsPlugin(),
  !isDev && new webpack.HashedModuleIdsPlugin(),
  autoUpdate && new CreateFileWebpack({
    path: path.resolve(appRootDir, 'public'),
    fileName: '__version__',
    content: timestampVersion
  })
].filter(i => !!i);

const clientConfig = Object.assign(webpackConfigFactory(options), {
  mode: NODE_ENV,
  entry: {
    login: path.resolve(appRootDir, 'src/client/login'),
    system: path.resolve(appRootDir, 'src/client/system'),
    user: path.resolve(appRootDir, 'src/client/user'),
    admin: path.resolve(appRootDir, 'src/client/admin'),
    invitation: path.resolve(appRootDir, 'src/app/invitation'),
    order: path.resolve(appRootDir, 'src/client/order'),
    experiment: path.resolve(appRootDir, 'src/client/experiment'),
    teacher: path.resolve(appRootDir, 'src/client/teacher'),
    exam: path.resolve(appRootDir, 'src/client/exam'),
    vnc: path.resolve(appRootDir, 'src/client/vnc')
  },
  output: {
    path: outputPath,
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].chunk.js',
    publicPath: '/client/',
    globalObject: 'this'
  },
  target: 'web',
  devServer: {
    host: '0.0.0.0',
    port: 8360,
    disableHostCheck: true,
    contentBase: path.join(appRootDir, 'public/'),
    overlay: {
      errors: true
    },
    // noInfo: true,
    proxy: [{
      context: ['/trans'],
      target: 'http://dev.gzgs.college.360.cn',
      changeOrigin: true
    }, {
      context: ['/resource_hvs'],
      target: 'http://dev.gzgs.college.360.cn',
      changeOrigin: true,
    }],
    inline: true,
    historyApiFallback: {
      rewrites: [{
        from: /^\/user/,
        to: '/client/user.html'
      },
      {
        from: /^\/teacher/,
        to: '/client/teacher.html'
      },
      {
        from: /^\/admin/,
        to: '/client/admin.html'
      },
      {
        from: /^\/system/,
        to: '/client/system.html'
      },
      {
        from: /^\/invitation/,
        to: '/client/invitation.html'
      },
      {
        from: /^\/order/,
        to: '/client/order.html'
      },
      {
        from: /^\/experiment/,
        to: '/client/experiment.html'
      },
      {
        from: /^\/exam/,
        to: '/client/exam.html'
      },
      {
        from: /^\/login/,
        to: '/client/login.html'
      },
      {
        from: /^\/vnc/,
        to: '/client/vnc.html'
      },
      ],
      index: '/client/user.html',
      verbose: false
    }
  }
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
  include: path.resolve(appRootDir, 'src')
})
module.exports = clientConfig;
