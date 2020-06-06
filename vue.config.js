const path = require('path');
const CopyPlugin = require('copy-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, dir);
}


module.exports = {
    publicPath: './',
    outputDir: 'dist',
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,
    lintOnSave: false,
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    },
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    // less 文件覆盖（文件路径为绝对路径）
                    'hack': `true; @import "${resolve('./src/style/resetVant.less')}";`
                    // 'hack': `true; @import "${path.join(__dirname, './src/assets/style/less.less')}";`
                },
                javascriptEnabled: true
            }
        }
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = false;
            config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = false;
            config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log'];
        }
        config.plugins.push(
            new CopyPlugin([{ from: 'static/download', to: 'download' }]),
            new CopyPlugin([{ from: 'static/ZDAO.apk', to: '' }]),
        )
    },

    chainWebpack: (config) => {
        config.resolve.alias
            .set('#', resolve('static'))
            .set('@', resolve('src'))
            .set('@api', resolve('src/api'))
            .set('@assets', resolve('src/assets'))
            .set('@comp', resolve('src/components'))
            .set('@views', resolve('src/views'))
            .set('@utils', resolve('src/utils'));
    },

    devServer: {
        // 反向代理
        // proxy: {
        //     '/': {
        //         // target: 'http://114.116.224.87:8088/', //生产地址
        //         target: 'http://192.168.3.70:9003/', //测试地址
        //         changeOrigin: true,
        //     }
        // }
    },
};

function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/style/resetVant.less'), // 需要全局导入的less
            ],
        })
}