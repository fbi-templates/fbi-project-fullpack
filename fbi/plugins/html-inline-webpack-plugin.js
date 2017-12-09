/**
 * make assets inline in html
 *
 * usage:
    const HtmlInlineWebpackPlugin = require('./plugins/html-inline-webpack-plugin')

    // webpack config
    plugins:[
      new HtmlInlineWebpackPlugin({
        env: prod ? 'production' : '',
        len: files.length
      })
    ]
 */

'use strict'

function HtmlInlineWebpackPlugin(options) {
  this.num = 0
  this.options = options || { env: '', len: 0, inline: true }
}

HtmlInlineWebpackPlugin.prototype.apply = function (compiler) {
  const _this = this
  const style_PATTERN = new RegExp('(<style>)', 'gi')
  compiler.plugin('compilation', function (compilation) {
    let filesToDelete = []
    compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
      _this.num++
      htmlPluginData.assets.js.forEach(function (item) {
        item = item.replace(htmlPluginData.assets.publicPath, '')
        const str = '<script type="text/javascript">' + compilation.assets[item].source() + '</script>'
        htmlPluginData.html = htmlPluginData.html.replace(/(<\/body>)/i, (match) => {
          return str + match
        })

        if (filesToDelete.indexOf(item) < 0) {
          filesToDelete.push(item)
        }
      })

      htmlPluginData.assets.css.forEach(function (item) {
        item = item.replace(htmlPluginData.assets.publicPath, '')
        const str = '<style>' + compilation.assets[item].source() + '</style>'
        htmlPluginData.html = htmlPluginData.html.replace(/(<\/head>)/i, (match) => {
          return str + match;
        })
        if (filesToDelete.indexOf(item) < 0) {
          filesToDelete.push(item)
        }
      })

      if (_this.options.len === _this.num) {
        if (_this.options.env === 'production' && filesToDelete.length) {
          filesToDelete.forEach(function (item) {
            delete compilation.assets[item] // 将已内联的项从打包列表中删除
          })
        }
      }
      callback(null, htmlPluginData)
    })
  })
}

module.exports = HtmlInlineWebpackPlugin