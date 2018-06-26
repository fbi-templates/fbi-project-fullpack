const path = require('path')
const globby = require('globby')

module.exports = (opts, files, data) => {
  return files.map(item => {
    const filename = path.basename(item)
    const chunkname = filename.replace(/.(html|hbs|handlebars)/, '')
    const hasJs = globby.sync(
      path.join(
        opts.mapping.src,
        opts.mapping.scripts.src,
        `${chunkname}.{js,ts,tsx}`
      )
    )
    const chunks = hasJs.length > 0 ? [opts.webpack.commons, chunkname] : []

    return {
      data,
      filename: chunkname + '.html',
      template: item,
      cache: false,
      inject: !opts.webpack.inlineAssets,
      chunks: chunks,
      chunksSortMode: (a, b) =>
        chunks.indexOf(a.names[0]) - chunks.indexOf(b.names[0]),
      excludeChunks: [],
      // https://github.com/kangax/html-minifier#options-quick-reference
      minify: ctx.isProd && opts.minify.templates.enable
        ? opts.minify.templates.options
        : false,
      inline: opts.webpack.inlineAssets
    }
  })
}
