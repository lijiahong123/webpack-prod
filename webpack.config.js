const path = require("path");
const HtmlWabpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取打包后js内的css样式为单独文件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css

process.env.NODE_ENV = "productuion" // 设置nodejs环境变量


// 抽离出来的cssloader
const cssLoader = [
    // 'style-loader', // 创建style标签,插入css
    MiniCssExtractPlugin.loader, // 抽离css为当都文件 取代 style-loader
    'css-loader',
    {
        loader: "postcss-loader",
        options: {
            postcssOptions: {
                plugins: [
                    [
                        "postcss-preset-env",
                        {
                            // Options
                        },
                    ],
                ],
            },
        },
    }

    /* 
    添加 css兼容性前缀 postcss-preset-env postcss-loader
     postcss-preset-env 能帮助postcss找到package.json中的 browserslist 里面的配置,通过配置加载指定的css兼容性样式
     "browserslist": {
        //  开发环境=> 不是mode指定的模式,而是nodejs环境变量 process.env.NODE_ENV = "development"
        "development": [
        "last 1 chrome varsion", //落后最新浏览器版本的1个版本之内
        "last 1 firefox version",
        "last 1 safari version"
        ],
        // 生产环境 (默认) =>  不是mode指定的模式,而是nodejs环境变量 process.env.NODE_ENV = "production"
        "production": [
        ">0.2%",  // 支持市场使用率>0.2%的浏览器
        "not dead", // 不处理已经死了的浏览器
        "not op_mini all" // 不处理op_mini 所有的浏览器
        ]
    }

    使用方式: 
        方式一.使用loader的默认配置  
        方式二.修改loader的配置,如下: (该写法好像与版本有关,暂时没生效,若生效,效果很好)
     {
         loader: "postcss-loader",
         options: {
             postcssOptions: {
                 ident: 'postcss',
                 plugins: () => [
                     // postcss的插件
                     require('postcss-preset-env')()
                 ]
             }
         }
     } */
]


module.exports = {
    mode: 'production', // 模式 production development  注意production模式下,会自动压缩js
    entry: './src/index.js', // 入口文件
    output: {
        filename: 'js/bandle.js', // 输出文件的文件名
        path: path.resolve(__dirname, 'dist') // 打包输出文件目录
    },
    devServer: {
        contentBase: 'dist', // 告诉服务器内容的来源
        compress: true, // 为每个静态文件开启 gzip
        port: 9000, //  指定端口
        open: true, // 自动打开浏览器
        progress: true // 打包时候是否显示进度

    },
    module: {
        // loader 规则
        rules: [
            // 处理js
            /* 
            语法检查: eslint eslint-loader,
            注意:只检查自己写的源代码,引用的代码不做检查
            设置检查规则: 用 airbnb 库的语法规范来做检查 --> eslint-config-airbnb-base  eslint-plugin-import  eslint
            然后添加 "extends": "airbnb-base/legacy" 到 .eslintrc 文件内
            
            js语法转换 Es6+ --> ES5-
            需要下载 ==>   babel-loader @babel/core @babel/preset-env 
                1. 基本js兼容性问题 --> @babel/preset-env
                    问题:只能转换基本语法,如promise不能转换
                2. 全部js兼容性处理 --> @babel/polyfill ,用法:在需要考虑兼容性的页面直接 import "@babel/polyfill"
                    问题: 我们只需要解决部分兼容性问题,但是引入了所有兼容性代码,体积太大了
                3.按需加载兼容性处理代码: --> core-js
            */
            {
                test: /\.js$/,
                exclude: /node_modules/, // 排除node_miodules
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [ // 预设: 指示babel做怎样的兼容性处理
                                ['@babel/preset-env',
                                    // core-js
                                    {
                                        useBuiltIns: 'usage', // 按需加载
                                        // 指定core-js版本
                                        corejs: {
                                            version: 3
                                        },
                                        // 指定兼容性做到哪个版本的浏览器
                                        targets: {
                                            chrome: '60',
                                            firefox: '60',
                                            ie: '6',
                                            safari: '10',
                                            edge: '17'
                                        }
                                    }]
                            ]
                        }
                    },
                    {
                        loader: 'eslint-loader',
                        options: {
                            fix: true // 打开自动修复
                        }
                    }
                ]
            },
            // 处理css
            {
                test: /\.css$/i,
                use: [...cssLoader]
            },
            // 处理less,scss,sass ...
            {
                test: /\.((sa|sc)ss)$/i,
                use: [
                    ...cssLoader,
                    "sass-loader"// 将 Sass 编译成 CSS
                ]
            },
            // 处理背景图片
            {
                test: /\.(png|jpeg|jpg|gif|svg|jfif)$/,
                loader: 'url-loader',
                options: {
                    name: '[hash:10].[ext]',//  [hash] 图片hash 值的前10位, [ext] 图片原来的扩展名
                    outputPath: 'images', // 输出目录(打包后的资源划分)
                    limit: 8 * 1024, // 小于8kb的图片就会编译成为base64,减少请求数量
                    esModule: false,  /*
                    问题: 因为url-loader默认使用es6模块化规范解析,而 html-loader引入图片是commonJs模块化规范
                    ,解析时候会出现src="[object Module]"
                    解决: 关闭url-loader的es6模块化,使用commonJs解析
                    */
                }
            },
            // 处理 html内的img标签 的src图片解析
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            // 处理除这些资源外的其他资源
            {
                exclude: /\.(js|css|html|scss|less|png|jpg|jpeg|gif|svg|jfif)$/, // 排除前面处理过的所有资源
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]', // 名字输出[ext]是保持原文件的扩展名
                    outputPath: 'media' // 输出目录(打包后的资源划分)
                }
            }
        ]
    },
    // 插件
    plugins: [
        // 自动生成html,并引入所有的文件,压缩html
        new HtmlWabpackPlugin({
            template: path.resolve(__dirname, "src", 'index.html'), // 模板地址
            // hash: true, // 所有加载的文件加入哈希,解决缓存问题
            minify: {
                removeComments: true, // 删除注释
                collapseWhitespace: true, // 折叠空行
            }
        }),
        // 每次打包前先清除打包文件
        new CleanWebpackPlugin(),
        // 抽离打包后的css文件为单独的css文件
        new MiniCssExtractPlugin({
            filename: 'css/index.css',
        }),
        // 压缩css,(不需要配置,引入即可)
        new OptimizeCssAssetsWebpackPlugin()
    ]
}