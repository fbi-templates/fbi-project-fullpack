const path = require('path')
const glob = require('glob')

module.exports = (opts, isProd) => {
  const hash = opts.webpack.format ? opts.webpack.format.hash : '[hash:6]'

  const assetsName = isProd ? `[name]-${hash}.[ext]` : `[name].[ext]?${hash}`

  return [
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: opts.webpack.assetsSizeLimit >> 0 || 10000,
        name: `${opts.mapping.images.dist}/${assetsName}`
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: opts.webpack.assetsSizeLimit >> 0 || 10000,
        name: `${opts.mapping.media.dist}/${assetsName}`
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: opts.webpack.assetsSizeLimit >> 0 || 10000,
        name: `${opts.mapping.fonts.dist}/${assetsName}`
      }
    }
  ]
}
