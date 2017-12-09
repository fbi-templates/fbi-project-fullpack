const path = require('path')
const webpack = require('webpack')
const rimraf = require('rimraf')
const remove = require('./helpers/remove')

ctx.env = require('./helpers/get-env')('build', 'prod')
ctx.isProd = true

const webpackConfig = require('./config/webpack.config')
const statsConfig = require('./config/stats.config')

async function build() {
  const dist = ctx.env.dist || 'dist'
  const target = ctx.utils.path.cwd(dist)
  if (await ctx.utils.fs.exist(target)) {
    await remove(target)
    ctx.logger.success(`Destination \`${dist}\` removed.`)
  }

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err)
      }
      console.log(stats.toString(statsConfig))
      ctx.logger.log(`Destination: \`${dist}\``)
      resolve()
    })
  })
}

module.exports = build
