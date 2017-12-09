const fs = require('fs')
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlInlineWebpackPlugin = require('../plugins/html-inline-webpack-plugin')
const makePlugins = require('../helpers/make-plugins')
const htmlPlugins = require('../helpers/html-plugins')

const noop = function() {}
const root = process.cwd()
const prod = ctx.isProd
const webpackOpts = ctx.options.webpack
const hash = webpackOpts.hash
const hot = !prod && webpackOpts.hot
const extractCss = !hot || prod
const tmplExts =
  ctx.options.webpack.tmpl === 'handlebars' ? 'html|hbs|handlebars' : 'html'
const tmplFiles = glob.sync(
  path.join(
    ctx.options.mapping.src,
    ctx.options.mapping.html.root,
    `*.@(${tmplExts})`
  )
)
const ver = {
  hash: '[hash:6]',
  chunkhash: '[chunkhash:6]',
  contenthash: '[contenthash:6]'
}
const assetsName =
  hash && prod ? `[name]-${ver.hash}.[ext]` : '[name].[ext]?[hash:8]'

const staticPath = path.join(root, ctx.options.mapping.static)
const needCopy = fs.existsSync(staticPath)

function stringify(obj) {
  const copy = JSON.parse(JSON.stringify(obj))
  Object.keys(copy).map(item => {
    copy[item] =
      typeof item === 'string' ? JSON.stringify(copy[item]) : copy[item]
  })
  return copy
}

const entryNames = []
const devModulesPath = ctx.nodeModulesPaths[1] || './node_modules'
const polyfillEntry = devModulesPath + '/babel-polyfill'
const hotEntry = devModulesPath + '/webpack-hot-middleware/client?reload=true'

function entries() {
  const entries = {}
  const filesPath = path.join(
    ctx.options.mapping.src,
    ctx.options.mapping.js,
    '*.js'
  )
  const commonFilesPath = path.join(
    ctx.options.mapping.src,
    ctx.options.mapping.jsCommon,
    '*.js'
  )
  const files = glob.sync(`src/js/*.js`)
  glob.sync(filesPath).map(item => {
    const name = path.basename(item, '.js')
    entryNames.push(name)
    entries[name] = []
    if (webpackOpts.esnext) {
      entries[name] = entries[name].concat([polyfillEntry])
    }
    if (hot) {
      entries[name] = entries[name].concat([hotEntry])
    }
    entries[name] = entries[name].concat(['./' + item])
  })
  const commons = glob.sync(commonFilesPath)
  if (commons.length) {
    entries[webpackOpts.commons] = commons.map(item => './' + item)
    entryNames.push(webpackOpts.commons)
  }
  return entries
}

const config = {
  entry: entries(),
  output: {
    filename: hash
      ? prod
        ? `${ctx.options.mapping.js}/[name]-${ver.chunkhash}.js`
        : `${ctx.options.mapping.js}/[name].js?${ver.hash}`
      : `${ctx.options.mapping.js}/[name].js`,
    path: prod ? ctx.utils.path.cwd(ctx.env.dist) : '/',
    publicPath: prod ? ctx.env.data.CDN : '/'
  },
  cache: true,
  externals: webpackOpts.externals,
  resolve: {
    modules: ctx.nodeModulesPaths,
    extensions: ['*', '.js', '.css', '.json'],
    unsafeCache: true,
    alias: webpackOpts.alias
  },
  resolveLoader: {
    modules: ctx.nodeModulesPaths
  },
  devtool: !prod ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre', // enforce: 'pre', enforce: 'post',
        loader: 'eslint-loader',
        exclude: /node_modules/,
        query: ctx.options.eslint.options
      },
      {
        test: /\.js$/,
        include: [path.join(root, ctx.options.mapping.src)],
        exclude: _path => !!_path.match(/node_modules/),
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['babel-preset-es2015', 'babel-preset-stage-0'],
              plugins: ['babel-plugin-transform-async-to-generator'],
              cacheDirectory: true
            }
          }
        ]
      },
      ['handlebars', 'hbs'].includes(webpackOpts.tmpl)
        ? {
            test: /\.(html|hbs|handlebars)$/i,
            use: [
              {
                loader: 'handlebars-loader',
                options: {
                  extensions: ['.hbs', '.html', '.handlebars'],
                  inlineRequires: `\/${ctx.options.mapping.img}\/`,
                  partialDirs: [
                    path.join(
                      root,
                      ctx.options.mapping.src,
                      ctx.options.mapping.html.partials
                    )
                  ],
                  helperDirs: [
                    path.join(
                      root,
                      ctx.options.mapping.src,
                      ctx.options.mapping.html.helpers
                    )
                  ],
                  debug: false
                }
              }
            ]
          }
        : {
            test: /\.html$/,
            use: 'html-loader'
          },
      {
        test: /\.css$/,
        loader: extractCss
          ? ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                'css-loader',
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: makePlugins(ctx.options.postcss.plugins).concat([
                      ctx.options.postcss.compress ? require('cssnano') : noop
                    ])
                  }
                }
              ],
              publicPath: webpackOpts.inline
                ? prod ? ctx.env.data.CDN : './'
                : '../'
            })
          : [
              'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: makePlugins(ctx.options.postcss.plugins)
                }
              }
            ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: webpackOpts.limit,
          name: `${ctx.options.mapping.img}/${assetsName}`
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: webpackOpts.limit,
          name: `${ctx.options.mapping.media}/${assetsName}`
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: webpackOpts.limit,
          name: `${ctx.options.mapping.fonts}/${assetsName}`
        }
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },
  plugins: [
    ...htmlPlugins(ctx.options, tmplFiles, ctx.env.data).map(
      item => new HtmlWebpackPlugin(item)
    ),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin(stringify(ctx.env.data)),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: webpackOpts.maxChunks
        ? webpackOpts.maxChunks >> 0 >= 1 ? webpackOpts.maxChunks >> 0 : 3
        : 3, // >= 1
      minChunkSize: webpackOpts.minChunkSize
        ? webpackOpts.minChunkSize >> 0
        : 1000
    }),
    webpackOpts.inline
      ? new HtmlInlineWebpackPlugin({
          env: prod ? 'production' : '',
          len: tmplFiles.length
        })
      : noop,
    prod ? new webpack.BannerPlugin(webpackOpts.banner) : noop,
    hot ? new webpack.HotModuleReplacementPlugin() : noop,
    extractCss
      ? new ExtractTextPlugin({
          filename: hash
            ? prod
              ? `${ctx.options.mapping.css}/[name]-${ver.contenthash}.css`
              : `${ctx.options.mapping.css}/[name].css?${ver.contenthash}`
            : `${ctx.options.mapping.css}/[name].css`,
          disable: false,
          allChunks: false
        })
      : noop,
    webpackOpts.commons
      ? new webpack.optimize.CommonsChunkPlugin({
          name: webpackOpts.commons,
          filename: hash
            ? prod
              ? `${ctx.options.mapping.js}/[name]-${ver.chunkhash}.js`
              : `${ctx.options.mapping.js}/[name].js?${ver.hash}`
            : `${ctx.options.mapping.js}/[name].js`,
          chunks: entryNames,
          minChunks: Infinity
        })
      : noop,
    webpackOpts.compress && prod
      ? new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
            warnings: false
          }
        })
      : noop,
    needCopy
      ? new CopyWebpackPlugin([
          {
            from: staticPath,
            to: '.',
            ignore: ['.*']
          }
        ])
      : noop
  ]
}

module.exports = config
