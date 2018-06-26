# fbi-project-fullpack
渐进式前端项目模板。

> 这是一个fbi项目模板. 如果你还没有安装 [fbi](https://github.com/AlloyTeam/fbi) , 请使用以下命令安装
>
> `$ npm i -g fbi` 或 `yarn global add fbi`

[README in English](./README.md)

## 环境要求
- `fbi v3.0+`
- `node v7.6+`



## 主要特性
- 支持纯 `HTML` 和 [Handlebars](http://handlebarsjs.com/) 模板
- 支持纯 `CSS` and [Sass-like](https://github.com/jonathantneal/precss) [PostCSS](http://postcss.org/)
- 支持 `ES5`, `ES2015`, `ES2016`, `ES2017`， 使用到的新特性会自动引入相关polyfills (polyfills会增加文件体积，请酌情使用) [了解更多](https://github.com/babel/babel/tree/master/packages/babel-preset-env#usebuiltins-usage)
- 支持 WebAssembly, Web Worker, Typescript
- 无限制的环境数据配置
- Http代理
- 路径映射
- Javascript和CSS的静态检查
- 压缩
- 高度可配置


## 使用方法

**创建项目**
```bash
$ cd path/to/workspace
$ fbi init https://github.com/fbi-templates/fbi-project-fullpack.git my-project
```

或

```bash
$ fbi add https://github.com/fbi-templates/fbi-project-fullpack.git
$ cd path/to/empty-folder
$ fbi init fullpack
```

**查看可用任务**
```bash
$ fbi ls
```

**运行任务**
```bash
$ fbi <task> [params]
```

## 任务

### `serve`
- 描述: 启动开发服务器
- 参数:
  - `port` `{Number}` 服务启动端口。 若已被占用，会自动切换。
  - `p`, `prod` `{Boolean}` 在prod构建目录启动静态服务器。
  - `t`, `test` `{Boolean}` 在test构建目录启动静态服务器。
- 别名: `s`
- 示例:
  - `fbi s -port=9999`
  - `fbi s -t`
  - `fbi s -p`

### `build`
- 描述: 为指定的环境构建项目
- 参数:
  - `p`, `prod` `{Boolean}` (默认) 生产环境
  - `t`, `test` `{Boolean}` 测试环境
  - `d`, `dev` `{Boolean}` 开发环境
- 别名: `b`
- 示例:
  - `fbi b -t`
  - `fbi b -t=true`
  - `fbi b -test=true`
  - `fbi b --p`
  - `fbi b -d`
### `clean`
- 描述: 清空构建目录
- 参数: 无
- 别名: `c`
- 示例:
  - `fbi c`
  - `fbi clean`


## 进阶用法
**怎样更改构建配置？**
1. 初始化选项文件到项目目录 
```bash
$ cd path/to/project
$ fbi init -o # or `--options`
```
2. 选项文件位于 `fbi/options.js`，可配置项非常多，内含说明和链接。

**怎样更改构建逻辑？**
1. 初始化选项和任务文件到项目目录  
```bash
$ cd path/to/project
$ fbi init -t # or `--tasks`
```
2. 文件位于 `fbi` 目录。按你的意思来。

**构建依赖(开发依赖)在哪里？**

构建依赖默认在fbi仓库。使用以下命令可下载到项目里。

```bash
$ fbi init -a  # or `--all`
```
> 注: 如果本地任务或选项文件已存在，原文件将会备份在`fbi-bak`目录。(不会覆盖)

## 选项
[`fbi/options.js`](https://github.com/fbi-templates/fbi-project-fullpack/blob/master/fbi/options.js)

| 属性	| 描述 | 链接 |
| --------  | ----------- | ----------- |
| data	| 环境数据配置 | [source](https://github.com/fbi-templates/fbi-project-fullpack/blob/master/fbi/options.js#L11) |
| proxy	| Http 代理 | [koa-proxies](https://github.com/vagusX/koa-proxies/blob/master/examples/server.js#L11)  [node-http-proxy](https://github.com/nodejitsu/node-http-proxy#options) |
| mapping	| 路径映射 | [source](https://github.com/fbi-templates/fbi-project-fullpack/blob/master/fbi/options.js#L43) |
| server	| 开发服务器配置 | [source](https://github.com/fbi-templates/fbi-project-fullpack/blob/master/fbi/options.js#L90) |
| webpack	| Webpack 简单配置 | [source](https://github.com/fbi-templates/fbi-project-fullpack/blob/master/fbi/options.js#L98) |
| lint	| 代码静态检查选项 | [eslint-config-airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base)  [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) |
| minify	| 压缩选项 | [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference)  [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin/#options)  [cssnano](http://cssnano.co/guides/presets/#how-do-presets-work) |
| copy	| 目录拷贝选项 | [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin#usage) |
| templates	| 模板引擎名称 | [source](https://github.com/fbi-templates/fbi-project-fullpack/blob/master/fbi/options.js#L192) |
| scripts	| babel-loader 选项 | [babel-loader](https://github.com/babel/babel-loader#options) |
| styles	| PostCSS 选项 | [postcss-loader](https://github.com/postcss/postcss-loader#options) |

## 更多信息
- [官方模板库](https://github.com/fbi-templates)
- [fbi完整文档](https://neikvon.gitbooks.io/fbi/content/)

## 开源协议
[MIT](https://opensource.org/licenses/MIT)

## 变更日志

- **v3.1.2**  (2018.06.26)
  - 为静态服务器添加页面索引
  - 添加 `tslint`
  - 删除 `webpack-stylish` 插件
  - 更新 `html-inline-webpack-plugin`
  - `eslint-config-airbnb` 替换为 `eslint-config-standard`

- **v3.1.1**  (2018.06.14)
  - 添加'typescript'选项以开启或关闭typescript支持
  - 生产模式时删除`webpack.NamedModulesPlugin`

- **v3**  (2018.06.08)
  - 更新开发依赖.
  - 现在使用 `webpack 4`.
  - 支持 'web worker', WebAssembly, Typescript.

- **v2.1.5**  (2018.01.26)
  - BugFixes: ES6编译失败(babel-loader include选项错误)

- **v2.1.0**  (2017.12.10)
  - Refactor: building logic, project structure.

- **v2.0.3**  (2017.12.09)
  - Compatible `webpack.commons` with old version

- **v2.0.2**  (2017.12.09)
  - Update package info. Add `.editorconfig` previously.

- **v2.0.0**  (2017.12.09)
  - initialization


