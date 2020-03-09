/**
 @Author：Ardans
 @Date：2020/3/3/15:35
 @FileName: setupProxy.js
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(createProxyMiddleware("/api", {
        target: "http://localhost:3333", //配置你要请求的服务器地址
        changeOrigin: true,
        pathRewrite: {
            "^/api": "/"
        }
    }))
};
