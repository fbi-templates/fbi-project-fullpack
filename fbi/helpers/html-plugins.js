const path = require('path')
const glob = require('glob')

module.exports = (opts, files, data) => {
  return files.map(item => {
    const filename = path.basename(item)
    const chunkname = filename.replace(/.(html|hbs|handlebars)/, '')
    const hasJs = ctx.utils.fs.existSync(
      path.join(opts.mapping.src, opts.mapping.js, `${chunkname}.js`)
    )
    const chunks = hasJs ? ['common', chunkname] : ['common']

    return {
      data,
      filename: chunkname + '.html',
      template: item,
      cache: false,
      inject: !opts.webpack.inline,
      chunks: chunks,
      chunksSortMode: (a, b) =>
        chunks.indexOf(a.names[0]) - chunks.indexOf(b.names[0]),
      excludeChunks: [],
      minify:
        opts.htmlCompress && ctx.isProd ? opts.htmlCompress.options : false,
      inline: opts.webpack.inline
    }
  })
}
