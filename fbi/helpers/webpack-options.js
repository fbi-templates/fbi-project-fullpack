const path = require('path')
const globby = require('globby')
const getTemplateDirs = require('./template-dirs')

let useTemplateEngine
let templateFiles
let handlebarsDirs

async function getEntries(
  opts,
  entryNames,
  generateCommonsOnDevMode,
  devModulesPath,
  isProd
) {
  const modulesPath = devModulesPath
  const entries = {}
  const filesPath = path.join(
    opts.mapping.src,
    opts.mapping.scripts.src,
    '*.js'
  )
  const commonFilesPath = path.join(
    opts.mapping.src,
    opts.mapping.scripts.vendors,
    '*.js'
  )
  useTemplateEngine = ['handlebars', 'hbs'].includes(opts.templates.template)
  const templateFilesPath = path.join(
    opts.mapping.root,
    opts.mapping.src,
    opts.mapping.templates.src,
    `*.@(${useTemplateEngine ? 'html|hbs|handlebars' : 'html'})`
  )

  const files = await Promise.all([
    globby(filesPath),
    globby(commonFilesPath),
    globby(templateFilesPath)
  ])
  const normalFiles = files[0]
  const commonFiles = files[1]
  templateFiles = files[2]

  if (useTemplateEngine) {
    handlebarsDirs = await getTemplateDirs(
      opts,
      path.join(process.cwd(), opts.mapping.root || '')
    )
  }

  normalFiles.map(item => {
    const name = path.basename(item, '.js')
    entryNames.push(name)
    entries[name] = []
    if (!isProd && opts.webpack.hot) {
      entries[name] = entries[name].concat([
        modulesPath + '/webpack-hot-middleware/client?reload=true'
      ])
    }
    entries[name] = entries[name].concat(['./' + item])
  })

  if (commonFiles.length) {
    generateCommonsOnDevMode = true
    entries[opts.webpack.commons] = commonFiles.map(item => './' + item)
  }
  if (commonFiles.length || opts.webpack.commons) {
    entryNames.push(opts.webpack.commons)
  }
  return entries
}

module.exports = async (opts, devModulesPath, isProd) => {
  const entryNames = []
  let generateCommonsOnDevMode = false
  const entries = await getEntries(
    opts,
    entryNames,
    generateCommonsOnDevMode,
    devModulesPath,
    isProd
  )

  return {
    entries,
    entryNames,
    generateCommonsOnDevMode,
    useTemplateEngine,
    templateFiles,
    handlebarsDirs
  }
}
