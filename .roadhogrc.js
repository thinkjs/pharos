export default {
  entry: 'www/static/src/index.js',
  publicPath:'/static/dist/',
  outputPath:'www/static/dist',
  ignoreMomentLocale:true,
  "env": {
      "development": {
        "extraBabelPlugins": [
          "dva-hmr",
          "transform-runtime",
  		    ["import", { "libraryName": "antd", "style": true }],
          ["module-resolver", {
            "root": ["./"],
            "alias": {
              "components":"./www/static/src/components",
              "utils":"./www/static/src/utils",
              "services":"./www/static/src/services"
            }
          }]
        ],
        ignoreMomentLocale:true,
      },
      "production": {
        "extraBabelPlugins": [
          "transform-runtime",
  		    ["import", { "libraryName": "antd", "style": true}],
          ["module-resolver", {
            "root": ["./"],
            "alias": {
              "components":"./www/static//src/components",
              "utils":"./www/static//src/utils",
              "services":"./www/static//src/services"
            }
          }]
        ],
        ignoreMomentLocale:true,        
      }
  }

}
