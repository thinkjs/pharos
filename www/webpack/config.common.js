const path = require('path');
const webpack = require('webpack');
const appRootDir = require('app-root-dir').get();
const HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const lessThemePlugin = require('./less-theme-plugin');

var htmlEntries = [{
  template: './src/index.html',
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
    extensions: [".js", ".tsx", ".ts"],
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
    }]
  },
  plugins: [
    ...htmlEntries,
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.DefinePlugin({
      'process.env.APP_ENV': JSON.stringify('development'),
    }),
  ].filter(i => i),
  // exclude: path.resolve(appRootDir, 'node_modules'),
  // include: path.resolve(appRootDir, 'src')
};

