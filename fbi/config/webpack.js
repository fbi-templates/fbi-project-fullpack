const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const templatePlugins = require('../helpers/template-plugins')
const confBase = require('./webpack.base')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

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
      options: Object.assign({}, {
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

  // Common chunk
  if (
    (ctx.isProd || confOptions.generateCommonsOnDevMode) &&
    opts.webpack.commons
  ) {

    config.optimization.splitChunks = {
      cacheGroups: {
        commons: {
          name: opts.webpack.commons,
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  }

  // Typescript
  if (opts.webpack.typescript) {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: !!opts.webpack.hot
        }
      }
    })

    config.plugins.push(new ForkTsCheckerWebpackPlugin())
  }

  // Template
  if (confOptions.useTemplateEngine) {
    config.module.rules.push({
      test: /\.(html|hbs|handlebars)$/i,
      use: [{
        loader: 'handlebars-loader',
        options: {
          extensions: ['.hbs', '.html', '.handlebars'],
          inlineRequires: `\/${opts.mapping.images.src}|${opts.mapping.media
              .src}\/`,
          partialDirs: confOptions.handlebarsDirs.partialDirs,
          helperDirs: confOptions.handlebarsDirs.helperDirs,
          debug: Boolean(ctx.mode.debug)
        }
      }]
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
    const InlinePlugin = require('../plugins/html-inline-webpack-plugin')
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
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    config.plugins.push(new CopyWebpackPlugin(opts.copy))
  }

  return config
}
