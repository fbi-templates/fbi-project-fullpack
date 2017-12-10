const webpack = require('webpack')

const opts = ctx.options
const postcssOptions = require('../helpers/postcss-options')(opts)

const config = {
  output: {
    filename: opts.webpack.hash
      ? `${opts.mapping.scripts.dist}/[name].js?${opts.webpack.format.hash}`
      : `${opts.mapping.scripts.dist}/[name].js`,
    path: '/',
    publicPath: '/'
  },
  // For development, use cheap-module-eval-source-map. For production, use cheap-module-source-map.
  devtool: opts.webpack.sourcemap || 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: postcssOptions
          }
        ]
      }
    ]
  },
  plugins: []
}

if (opts.webpack.hot) {
  config.plugins = config.plugins.concat([
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ])
}

module.exports = config
