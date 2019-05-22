const path = require('path');
const webpack = require('webpack');
// const lessThemePlugin = require('./less-theme-plugin');

module.exports = function ({
  isNode = false,
  env,
  NODE_ENV,
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
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        React: 'react'
      }),
      new webpack.DefinePlugin({
        'process.env.APP_ENV': JSON.stringify(env),
        // 'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'CLIENT_RENDER': JSON.stringify('client_render')
      }),
    ].filter(i => i)
  };

}
