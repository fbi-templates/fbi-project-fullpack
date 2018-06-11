const webpack = require('webpack')
const remove = require('./helpers/remove')

ctx.env = require('./helpers/get-env')('build', 'prod')
ctx.noop = function() {}
ctx.isProd = true
const opts = ctx.options

const webpackConfig = require('./config/webpack')

async function build() {
  const dist = ctx.env.dist || 'dist'
  const target = ctx.utils.path.cwd(dist)

  if (await ctx.utils.fs.exist(target)) {
    await remove(target)
    ctx.logger.log(`Destination \`${dist}\` removed.`)
  } else {
    ctx.logger.log(`Destination: \`${dist}\``)
  }

  const webpackConfigs = await webpackConfig(opts, 'prod')

  return new Promise((resolve, reject) => {
    webpack(webpackConfigs, err => {
      if (err) {
        reject(err)
      }

      resolve()
    })
  })
}

module.exports = build
