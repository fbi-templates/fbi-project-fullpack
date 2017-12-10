const path = require('path')

module.exports = async (opts, root) => {
  const partialDirs = []
  const helperDirs = []

  const partialPath = path.join(
    root,
    opts.mapping.src,
    opts.mapping.templates.handlebars.partials
  )
  const helperPath = path.join(
    root,
    opts.mapping.src,
    opts.mapping.templates.handlebars.helpers
  )

  if (await ctx.utils.fs.exist(partialPath)) {
    partialDirs.push(partialPath)
  } else {
    ctx.logger.warn(
      `Warning: Handlebars partials folder \`${opts.mapping.templates.handlebars
        .partials}\` not exist. `
    )
  }

  if (await ctx.utils.fs.exist(helperPath)) {
    helperDirs.push(helperPath)
  } else {
    ctx.logger.warn(
      `Warning: Handlebars helpers folder \`${opts.mapping.templates.handlebars
        .helpers}\` not exist. `
    )
  }

  return {
    partialDirs,
    helperDirs
  }
}
