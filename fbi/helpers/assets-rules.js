module.exports = (opts, isProd) => {
  const hash = opts.webpack.format ? opts.webpack.format.hash : '[hash:6]'

  const assetsName = isProd ? `[name]-${hash}.[ext]` : `[name].[ext]?${hash}`
  const sizeLimit = opts.webpack.assetsSizeLimit >> 0 || 10000
  const loader = 'url-loader'

  return [
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader,
      options: {
        limit: sizeLimit,
        name: `${opts.mapping.images.dist}/${assetsName}`
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader,
      options: {
        limit: sizeLimit,
        name: `${opts.mapping.media.dist}/${assetsName}`
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader,
      options: {
        limit: sizeLimit,
        name: `${opts.mapping.fonts.dist}/${assetsName}`
      }
    }
  ]
}
