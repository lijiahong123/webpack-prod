# webpack-prod

### 语法检查: eslint eslint-loader,
+ 注意:只检查自己写的源代码,引用的代码不做检查
    +   设置检查规则: 用 airbnb 库的语法规范来做检查 --> eslint-config-airbnb-base  eslint-plugin-import  eslint
然后添加 "extends": "airbnb-base/legacy" 到 .eslintrc 文件内

### js语法转换 Es6+ --> ES5-
+ 需要下载 ==>   babel-loader @babel/core @babel/preset-env 
    + 1. 基本js兼容性问题 --> @babel/preset-env
        问题:只能转换基本语法,如promise不能转换
    + 2. 全部js兼容性处理 --> @babel/polyfill ,用法:在需要考虑兼容性的页面直接 import "@babel/polyfill"
        问题: 我们只需要解决部分兼容性问题,但是引入了所有兼容性代码,体积太大了
    + 3. 按需加载兼容性处理代码: --> core-js
  ```javascript
  {
    test: /\.js$/,
    exclude: /node_modules/, // 排除node_miodules
    use: [
        {
            loader: "babel-loader",
            options: {
                presets: [ // 预设: 指示babel做怎样的兼容性处理
                    [
                        '@babel/preset-env',
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
                        }
                    ]
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
  ```