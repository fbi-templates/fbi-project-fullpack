const webpack = require('webpack')
const opts = ctx.options
const postcssOptions = require('../helpers/postcss-options')(opts)

const config = {
  mode: 'development',
  output: {
    filename: opts.webpack.hash
      ? `${opts.mapping.scripts.dist}/[name].js?${opts.webpack.format.hash}`
      : `${opts.mapping.scripts.dist}/[name].js`,
    path: '/',
    publicPath: '/',
    pathinfo: true,
    globalObject: 'this'
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
  plugins: [new webpack.NamedModulesPlugin()],
  performance: {
    hints: false
  }
}

module.exports = config
