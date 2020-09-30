module.exports = {
  lintOnSave: false,
  // 配置 webpack-dev-server 行为。
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
    proxy: {
          '/api': {
                target: 'http://localhost:8099',//后端接口地址
                changeOrigin: true,//是否允许跨越
                secure: false,
                // ws: true,
                pathRewrite: {
                    '^/api': '/api'   // 请求数据路径别名,这里是注意将static/mock放入public文件夹
                }
          }
   },
   before: app => {}
  },
}