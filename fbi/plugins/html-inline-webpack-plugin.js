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

function HtmlInlineWebpackPlugin (options) {
  this.num = 0
  this.options = options || { env: '', len: 0, inline: true }
}

HtmlInlineWebpackPlugin.prototype.apply = function (compiler) {
  const _this = this
  const filesToDelete = []
  compiler.hooks.compilation.tap('html-inline-webpack-plugin', compilation => {
    compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
      'html-inline-webpack-plugin',
      (htmlPluginData, callback) => {
        _this.num++

        // Inline javascripts
        htmlPluginData.assets.js.forEach(item => {
          item = item.replace(htmlPluginData.assets.publicPath, '')
          const str =
            '<script>' + compilation.assets[item].source() + '</script>'
          htmlPluginData.html = htmlPluginData.html.replace(
            /(<\/body>)/i,
            match => str + match
          )
          if (filesToDelete.indexOf(item) < 0) {
            filesToDelete.push(item)
          }
        })

        // Inline stylesheets
        htmlPluginData.assets.css.forEach(item => {
          item = item.replace(htmlPluginData.assets.publicPath, '')
          const str = '<style>' + compilation.assets[item].source() + '</style>'
          htmlPluginData.html = htmlPluginData.html.replace(
            /(<\/head>)/i,
            match => {
              return str + match
            }
          )
          if (filesToDelete.indexOf(item) < 0) {
            filesToDelete.push(item)
          }
        })

        if (_this.options.len === _this.num) {
          if (_this.options.env === 'production' && filesToDelete.length > 0) {
            // Remove inlined files from bundle list
            filesToDelete.forEach(item => {
              delete compilation.assets[item]
            })
          }
        }
        callback(null, htmlPluginData)
      }
    )
  })
}

module.exports = HtmlInlineWebpackPlugin
