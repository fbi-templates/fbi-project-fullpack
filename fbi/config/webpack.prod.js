const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const opts = ctx.options
const postcssOptions = require('../helpers/postcss-options')(opts, 'prod')

const config = {
  output: {
    filename: opts.webpack.hash
      ? `${opts.mapping.scripts.dist}/[name]-${opts.webpack.format.hash ||
          '[hash:6]'}.js`
      : `${opts.mapping.scripts.dist}/[name].js`,
    path: ctx.utils.path.cwd(ctx.env.dist),
    publicPath: ctx.env.data.CDN || './'
  },
  // For development, use cheap-module-eval-source-map. For production, use cheap-module-source-map.
  devtool: opts.sourcemap || false,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader',
              options: postcssOptions
            }
          ],
          // assets path prefix in css
          publicPath: opts.webpack.inline ? ctx.env.data.CDN || './' : '../'
        })
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),

    // extract css into its own file
    new ExtractTextPlugin({
      filename: opts.webpack.hash
        ? `${opts.mapping.styles.dist}/[name]-${opts.webpack.contenthash ||
            '[contenthash:6]'}.css`
        : `${opts.mapping.styles.dist}/[name].css`,
      disable: false,
      allChunks: false
    }),

    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin()
  ]
}

if (opts.minify.scripts.enable) {
  config.plugins.push(
    new UglifyJSPlugin(
      Object.assign(
        {},
        {
          // https://github.com/webpack-contrib/uglifyjs-webpack-plugin/#options
          test: /\.js($|\?)/i,
          parallel: true,
          cache: true,
          sourceMap: Boolean(opts.webpack.sourcemap),
          uglifyOptions: {
            ecma: 8
          }
        },
        opts.minify.scripts.options
      )
    )
  )
}

if (opts.webpack.banner) {
  config.plugins.push(new webpack.BannerPlugin(opts.webpack.banner))
}

module.exports = config
