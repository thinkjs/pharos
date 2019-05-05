const path = require('path');
const webpack = require('webpack');
const appRootDir = require('app-root-dir').get();
const lessThemePlugin = require('./less-theme-plugin');

function toApp(relativePath) {
  return path.resolve(appRootDir, 'src/app', relativePath);
}

module.exports = function ({
  isNode = false,
  env,
  NODE_ENV,
  devtool
}) {

  function cssLoaders(loader) {
    var use;

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

  return {
    resolve: {
      extensions: [".js"],
      alias: {
        common: toApp('common'),
        user: toApp('user'),
        system: toApp('system'),
        admin: toApp('admin'),
        order: toApp('order'),
        experiment: toApp('experiment'),
        login: toApp('login'),
        teacher: toApp('teacher'),
        exam: toApp('exam'),
        vnc: toApp('vnc'),
        image: path.resolve(appRootDir, 'public/image'),
        vendor: path.resolve(appRootDir, 'public/vendor')
      },
      mainFields: ["browser", "main"]
    },
    module: {
      rules: [{
          test: /\.css$/,
          use: cssLoaders(),
        },
        {
          test: /\.less$/i,
          use: cssLoaders([{
            loader: "less-loader",
            options: {
              plugins: [
                new lessThemePlugin()
              ]
            }
          }])
        },
        {
          test: /\.(png|jpg|gif|ttf|eot|svg|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            name: '[path][name].[ext]&limit=200000'
          }
        }
      ]
    },
    devtool,
    plugins: [
      new webpack.ProvidePlugin({
        React: 'react'
      }),
      new webpack.DefinePlugin({
        'process.env.APP_ENV': JSON.stringify(env),
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'CLIENT_RENDER': JSON.stringify('client_render')
      }),
    ].filter(i => i)
  };

}
