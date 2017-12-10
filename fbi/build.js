const path = require('path')
const webpack = require('webpack')
const rimraf = require('rimraf')
const remove = require('./helpers/remove')

ctx.env = require('./helpers/get-env')('build', 'prod')
ctx.noop = function() {}

const webpackConfig = require('./config/webpack')

const opts = ctx.options
ctx.isProd = true

const statsConfig = require('./config/stats.config')

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
    webpack(webpackConfigs, (err, stats) => {
      if (err) {
        reject(err)
      }
      console.log(stats.toString(statsConfig))

      resolve()
    })
  })
}

module.exports = build
