const path = require('path');
const webpack = require('webpack');
const appRootDir = require('app-root-dir').get();
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const lessThemePlugin = require('./less-theme-plugin');
function toApp(relativePath) {
  return path.resolve(appRootDir, 'src', relativePath);
}

var htmlEntries = [{
  template: './webpack/html/index.html',
  filename: 'index.html',
}].map(v => {
  return new HtmlWebpackPlugin({
    template: path.join(appRootDir, v.template),
    filename: v.filename,
  })
})

function cssLoaders(loader) {
  var use;
  var isNode = false;

  use = isNode ? [
    'css-loader/locals'
  ] : [
      'style-loader',
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          // parser: 'sugarss',
          plugins: () => [
            require('autoprefixer')({
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
              ],
              flexbox: 'no-2009',
            })
          ]
        }
      }
    ]
  if (loader) {
    use.push(...loader);
  }
  return use;
}

module.exports = {


  entry: ['@babel/polyfill', './src/index.tsx'],
  output: {
    path: path.join(__dirname, '../static'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  target: 'web',
  resolve: {
    extensions: [".tsx", ".ts", ".js",],
    alias: {
      "@components": toApp('components'),
      "@config": toApp('config'),
      "@utils": toApp('utils'),
      "@pages": toApp('pages'),
      "@store": toApp('store'),
    },
    mainFields: ["browser", "main"]
  },
  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      loader: ['babel-loader', 'ts-loader']
    }, {
      test: /\.css$/,
      use: cssLoaders(),
    },
    {
      test: /\.less$/i,
      use: cssLoaders([{
        loader: "less-loader",
        // options: {
        //   plugins: [
        //     new lessThemePlugin()
        //   ]
        // }
      }])
    },
    {
      test: /\.(png|jpg|gif|ttf|eot|svg|woff|woff2)$/,
      loader: 'url-loader',
      options: {
        name: '[path][name].[ext]&limit=200000'
      }
    },
      // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //   "react": "React",
  //   "react-dom": "ReactDOM"
  // },
  plugins: [
    ...htmlEntries,
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new webpack.DefinePlugin({
      'process.env.APP_ENV': JSON.stringify('development'),
    }),
  ].filter(i => i),
  // exclude: path.resolve(appRootDir, 'node_modules'),
  // include: path.resolve(appRootDir, 'src')
};

