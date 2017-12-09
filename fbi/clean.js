const path = require('path')
const remove = require('./helpers/remove')
ctx.env = require('./helpers/get-env')('clean', 'prod', true)

async function clean() {
  const names = Object.keys(ctx.options.data)
  if (!names || names.length < 1) {
    return
  }

  return Promise.all(
    names.map(async item => {
      const suffix = item === 'prod' ? '' : item
      const dir = `${ctx.options.mapping.dist}${suffix ? '-' + suffix : ''}`
      const target = ctx.utils.path.cwd(dir)
      if (await ctx.utils.fs.exist(target)) {
        await remove(target)
        ctx.logger.log(`Directory \`${dir}\` removed.`)
      }
    })
  )
}

module.exports = clean
