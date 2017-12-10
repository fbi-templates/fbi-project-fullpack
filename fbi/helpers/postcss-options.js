const makePlugins = require('./make-plugins')

module.exports = (opts, isProd) => {
  const options = Object.assign(
    {
      ident: 'postcss'
    },
    opts.styles
  )

  options.plugins = makePlugins(options.plugins)

  if (opts.lint.styles.enable) {
    options.plugins = makePlugins({
      // https://github.com/stylelint/stylelint/blob/master/docs/user-guide/postcss-plugin.md
      stylelint: opts.lint.styles.options
    }).concat(options.plugins)
  }

  if (isProd && opts.minify.styles.enable) {
    options.plugins.push(require('cssnano')(opts.minify.styles.options))
  }

  return options
}
