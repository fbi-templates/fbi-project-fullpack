const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const opts = ctx.options
const postcssOptions = require('../helpers/postcss-options')(opts, 'prod')

const config = {
  mode: 'none',
  output: {
    filename: opts.webpack.hash ?
      `${opts.mapping.scripts.dist}/[name]-${opts.webpack.format.hash ||
          '[hash:6]'}.js` : `${opts.mapping.scripts.dist}/[name].js`,
    path: ctx.utils.path.cwd(ctx.env.dist),
    publicPath: ctx.env.data.CDN || './'
  },
  // For development, use cheap-module-eval-source-map. For production, use cheap-module-source-map.
  devtool: opts.sourcemap || false,
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            // assets path prefix in css
            publicPath: opts.webpack.inline ? ctx.env.data.CDN || './' : '../'
          }
        },
        'css-loader',
        {
          loader: 'postcss-loader',
          options: postcssOptions
        }
      ]
    }]
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

    // extract css into its own file
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: opts.webpack.hash ?
        `${opts.mapping.styles.dist}/[name]-${opts.webpack.contenthash ||
            '[contenthash:6]'}.css` : `${opts.mapping.styles.dist}/[name].css`,
    }),

    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin()
  ]
}

if (opts.minify.scripts.enable) {
  config.plugins.push(
    new UglifyJSPlugin(
      Object.assign({}, {
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
