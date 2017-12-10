const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const templatePlugins = require('../helpers/template-plugins')
const InlinePlugin = require('../plugins/html-inline-webpack-plugin')
const confBase = require('./webpack.base')

module.exports = async (opts, env) => {
  // Make sure options
  require('../helpers/options')(opts)

  // Make webpack config
  const devModulesPath = ctx.nodeModulesPaths[1] || './node_modules'
  const confOptions = await require('../helpers/webpack-options')(
    opts,
    devModulesPath,
    ctx.isProd
  )
  const confEnv = require(`./webpack.${env}`)
  const config = merge(confBase, confEnv)
  config.entry = confOptions.entries

  // Set assets rules
  const assetsRules = require('../helpers/assets-rules')(opts, ctx.isProd)
  config.module.rules = config.module.rules.concat(assetsRules)

  if (opts.lint.scripts.enable) {
    config.module.rules.push({
      test: /\.js$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      exclude: /node_modules/,
      options: Object.assign(
        {},
        {
          root: true,
          parser: 'babel-eslint',
          formatter: require('eslint-friendly-formatter'),
          parserOptions: {
            sourceType: 'module'
          },
          env: {
            browser: true
          },
          extends: 'airbnb-base'
        },
        opts.lint.scripts.options
      )
    })
  }

  if (opts.lint.styles.enable) {
  }

  // Common chunk
  if (
    (ctx.isProd || confOptions.generateCommonsOnDevMode) &&
    opts.webpack.commons
  ) {
    config.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: opts.webpack.commons,
        filename: opts.webpack.hash
          ? ctx.isProd
            ? `${opts.mapping.scripts.dist}/[name]-${opts.webpack.format
                .hash}.js`
            : `${opts.mapping.scripts.dist}/[name].js?${opts.webpack.format
                .hash}`
          : `${opts.mapping.scripts.dist}/[name].js`,
        chunks: confOptions.entryNames,
        minChunks: Infinity
      })
    )
  }

  // Template
  if (confOptions.useTemplateEngine) {
    config.module.rules.push({
      test: /\.(html|hbs|handlebars)$/i,
      use: [
        {
          loader: 'handlebars-loader',
          options: {
            extensions: ['.hbs', '.html', '.handlebars'],
            inlineRequires: `\/${opts.mapping.images.src}|${opts.mapping.media
              .src}\/`,
            partialDirs: confOptions.handlebarsDirs.partialDirs,
            helperDirs: confOptions.handlebarsDirs.helperDirs,
            debug: Boolean(ctx.mode.debug)
          }
        }
      ]
    })
  } else {
    config.module.rules.push({
      test: /\.html$/,
      use: 'html-loader'
    })
  }

  // Html plugins
  config.plugins = config.plugins.concat(
    templatePlugins(opts, confOptions.templateFiles, ctx.env.data).map(
      item => new HtmlWebpackPlugin(item)
    )
  )

  // Inline assets?
  if (opts.webpack.inlineAssets) {
    config.plugins.push(
      new InlinePlugin({
        env: ctx.isProd ? 'production' : '',
        len: confOptions.templateFiles.length
      })
    )
  }

  // Need copy
  // https://github.com/webpack-contrib/copy-webpack-plugin#usage
  if (opts.copy.length > 0) {
    config.plugins.push(new CopyWebpackPlugin(opts.copy))
  }

  return config
}
