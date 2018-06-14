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

const Stylish = require('webpack-stylish')

const config = {
  target: opts.webpack.target || 'web',
  cache: opts.webpack.cache,
  externals: opts.webpack.externals,
  resolve: {
    modules: ctx.nodeModulesPaths,
    // extensions: ['*', '.ts', '.tsx', '.js', '.css', '.json'],
    unsafeCache: true,
    alias: opts.webpack.alias
  },
  resolveLoader: {
    modules: ctx.nodeModulesPaths
  },
  module: {
    noParse: opts.noParse ?
      opts.noParse :
      () => {
        return false
      },
    rules: [{
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            name: (opts.webpack.hash && ctx.env.name === 'prod') ?
              `${opts.mapping.scripts.workersDist}[name]-${opts.webpack.format.hash ||
                '[hash:6]'}.js` : `${opts.mapping.scripts.workersDist}[name].js?[hash:6]`,
          }
        }
      }, {
        test: /\.js$/,
        exclude: _path => !!_path.match(/node_modules/),
        use: [{
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
        test: /\.wasm$/,
        type: 'javascript/auto',
        use: ['wasm-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(stringify(ctx.env.data)),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: opts.webpack.maxChunks ?
        opts.webpack.maxChunks >> 0 >= 1 ? opts.webpack.maxChunks >> 0 : 10 : 10, // >= 1
      minChunkSize: opts.webpack.minChunkSize ?
        opts.webpack.minChunkSize >> 0 : 10000
    }),
    new Stylish()
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
  },
  optimization: {}
}

module.exports = config
