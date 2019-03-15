const path = require('path')

module.exports = {
  entry: './index.vue',
  // output: {
  //   path: path.resolve(__dirname, '../out'),
  //   filename: '[name].js'
  // },
  mode: 'development',
  module: {
    rules: [{
      // 可自行设置需要的模板后缀
      test: /\.vue$/,
      loader: '../lib/loader.js',
      options: {
        // 配置解析html后缀
        htmlExt: 'wxml',
        // 配置解析wxss后缀
        cssExt: 'wxss',
        // 配置解析js后缀
        jsExt: 'js'
      }
    }]
  }
}
