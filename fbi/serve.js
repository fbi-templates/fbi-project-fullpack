const http = require('http')
const Koa = require('koa')
const koaStatic = require('koa-static')
const webpack = require('webpack')
const koaWebpack = require('koa-webpack')
const statsConfig = require('./config/stats.config')

ctx.env = require('./helpers/get-env')('serve')
const webpackConfig = require('./config/webpack.config')
// console.log(ctx.env)

function server(app) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig)
    const middleware = koaWebpack({
      compiler,
      dev: {
        publicPath: webpackConfig.output.publicPath,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        stats: statsConfig
      }
    })

    app.use(middleware)
    app.use(koaStatic(ctx.options.mapping.src || 'src'))

    middleware.dev.waitUntilValid(() => resolve(app))
  })
}

function listen(app, startPort) {
  return new Promise((resolve, reject) => {
    let port = startPort
    startPort += 1
    const server = http.createServer(app.callback())

    server.listen(port, err => {
      server.once('close', () => {
        app.listen(port, err => {
          return err ? reject(err) : resolve(port)
        })
      })
      server.close()
    })
    server.on('error', err => {
      ctx.logger.warn(`Port ${port} is already in use, trying ${startPort}...`)
      resolve(listen(app, startPort))
    })
  })
}

async function start() {
  const app = new Koa()
  if (ctx.env.dist && ctx.env.name !== 'dev') {
    ctx.logger.log(`Server root: ${ctx.env.dist}.`)
    if (await ctx.utils.fs.exist(ctx.env.dist)) {
      app.use(koaStatic(ctx.env.dist))
    } else {
      throw `Directory \`${ctx.env.dist}\` not exist.`
    }
  } else {
    await server(app)
  }

  let startPort = ctx.env.params.port >> 0 || ctx.options.server.port
  const port = await listen(app, startPort)
  ctx.logger.info(`Server runing at http://${ctx.options.server.host}:${port}`)
}

module.exports = start
