const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const stringify = require('../helpers/stringify')

const opts = ctx.options
const devModulesPath = ctx.nodeModulesPaths[1] || './node_modules'

// Babel
const babelOptions = require('../helpers/babel-options')(
  opts.scripts,
  devModulesPath
)
console.log('path.join(opts.mapping.root, opts.mapping.src):',path.join(process.cwd(), opts.mapping.root, opts.mapping.src))

const config = {
  target: opts.webpack.target || 'web',
  cache: opts.webpack.cache,
  externals: opts.webpack.externals,
  resolve: {
    modules: ctx.nodeModulesPaths,
    extensions: ['*', '.js', '.css', '.json'],
    unsafeCache: true,
    alias: opts.webpack.alias
  },
  resolveLoader: {
    modules: ctx.nodeModulesPaths
  },
  module: {
    noParse: ctx.options.noParse
      ? ctx.options.noParse
      : () => {
          return false
        },
    rules: [
      {
        test: /\.js$/,
        // include: [path.join(opts.mapping.root, opts.mapping.src)],
        exclude: _path => !!_path.match(/node_modules/),
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve('node_modules/.cache/cache-loader')
            }
          },
          {
            loader: 'babel-loader',
            options: babelOptions
          }
        ]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(stringify(ctx.env.data)),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: opts.webpack.maxChunks
        ? opts.webpack.maxChunks >> 0 >= 1 ? opts.webpack.maxChunks >> 0 : 10
        : 10, // >= 1
      minChunkSize: opts.webpack.minChunkSize
        ? opts.webpack.minChunkSize >> 0
        : 10000
    })
  ],
  performance: {
    hints: false
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

module.exports = config
