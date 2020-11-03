const path = require('path');
const fs = require('fs');
let a=process.env.NODE_ENV
const mockData = require('./mock/mock');
console.log(a,"aaaaaa")
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  lintOnSave: true,
  assetsDir:'static',
  filenameHashing:true, //文件名hash
  runtimeCompiler: true, //关键点在这
  // 调整内部的 webpack 配置。
  // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/webpack.md
  chainWebpack: (config)=> {
    config.plugin('html').tap(args => {
      // args[0].filename = path.resolve(__dirname, isProd ? 'dist' : 'dist-pre') + '/index.html';
      // 设置将打包后的资源不要自动插入html中
      // args[0].inject = false;
      console.log(args[0],"args[0].inject")
      return args;
    });
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@common', resolve('src/common'))
      .set('@API', resolve('src/service/API'));
  },
  configureWebpack:{},
  // 配置 webpack-dev-server 行为。
  devServer: {
    open: true,
    host: '127.0.0.1',
    port: 8080,
    https: false,
    hotOnly: false,
    // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#配置代理
    proxy: null, // string | Object
    before: app => {
      for (var path in mockData){
        (function(p,f){
          app.get(p, (req, res, next) => {
            res.json(JSON.parse(fs.readFileSync(f)));
          });
        })(path,mockData[path])
      }
    }
  }
}
