const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const webpack = require('webpack') //引入webpack库

module.exports = {
  devServer: {
    disableHostCheck: true
  },
  // 关闭eslint校验报错
  lintOnSave: false,
  productionSourceMap: false,
  assetsDir: 'static',
  publicPath: './',
  // publicPath: '/auto/',
  devServer: {
    //设置代理
    proxy: {
      '/api': {
        target: 'http://localhost:7211', //mit-接口
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  },
}
