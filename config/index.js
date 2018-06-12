var path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        //index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'commonStatic',
        assetsPublicPath: '/',
        productionSourceMap: true,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css']
    },
    dev: {
        env: require('./dev.env'),
        port: 8070,
        assetsSubDirectory: 'commonStatic',
        assetsPublicPath: '/',
        // proxyTable: { // 代理
        //     '/admin': {
        //         target: 'http://10.1.11.47:8030', // 服务器
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/admin': '/admin'
        //         }
        //     }
        // },
        // proxyTable: { // 代理
        //     '/admin': {
        //         target: 'http://admin.91iji.com', // 服务器
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/admin': '/admin'
        //         }
        //     }
        // },
        proxyTable: { // 代理
            '/admin': {
                target: 'http://10.1.11.48:8090/api', // 仅h5注册页用这个地址
                // target: 'http://app-yfb.91iji.com/api', // 预发布
                // target: 'https://app.91iji.com/api', //正式
                changeOrigin: true,
                pathRewrite: {
                    '^/admin': '/'
                }
            }
        },
        cssSourceMap: false
    }
}
