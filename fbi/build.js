const webpack = require('webpack')
const remove = require('./helpers/remove')

ctx.env = require('./helpers/get-env')('build', 'prod')
ctx.noop = function () {}
ctx.isProd = true
const opts = ctx.options

const webpackConfig = require('./config/webpack')
const statsConfig = require('./config/stats')

async function build () {
  const dist = ctx.env.dist || 'dist'
  const target = ctx.utils.path.cwd(dist)

  if (await ctx.utils.fs.exist(target)) {
    await remove(target)
    ctx.logger.log(`Destination \`${dist}\` removed.`)
  } else {
    ctx.logger.log(`Destination: \`${dist}\``)
  }

  const { webpackConfigs } = await webpackConfig(opts, 'prod')

  return new Promise((resolve, reject) => {
    webpack(webpackConfigs, (err, stats) => {
      if (err) {
        reject(err)
      }
      console.log(stats.toString(statsConfig))

      ctx.logger.log(`Tips: You can run ${ctx.utils.style.cyan('fbi s -p')} to serve the dist folder`)
      resolve()
    })
  })
}

module.exports = build
