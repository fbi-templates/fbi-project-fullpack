const http = require('http')
const Koa = require('koa')
const koaStatic = require('koa-static')
const webpack = require('webpack')
const proxy = require('koa-proxies')
const koaWebpack = require('./plugins/koa-webpack')
const statsConfig = require('./config/stats')

// Set env
ctx.env = require('./helpers/get-env')('serve')
ctx.noop = function() {}

const makeWebpackConfig = require('./config/webpack')
const opts = ctx.options

async function server(app) {
  const webpackConfigs = await makeWebpackConfig(opts, 'dev')

  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfigs)
    const middleware = koaWebpack({
      compiler,
      dev: {
        publicPath: webpackConfigs.output.publicPath,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        watchOptions: {
          aggregateTimeout: 300,
          poll: true
        },
        stats: statsConfig
      }
    })

    app.use(middleware)
    app.use(koaStatic(opts.mapping.src || 'src'))

    const proxyTableKeys = Object.keys(opts.proxy)
    if (proxyTableKeys.length) {
      // https://github.com/vagusX/koa-proxies/blob/master/examples/server.js#L11
      proxyTableKeys.map(context => {
        let options = opts.proxy[context]
        if (typeof options === 'string') {
          options = {
            target: options,
            changeOrigin: true,
            logs: Boolean(ctx.mode.debug),
            rewrite: _path => _path.replace(context, '/')
          }
        }
        app.use(proxy(context, options))
      })
    }

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

  let startPort = ctx.env.params.port >> 0 || opts.server.port
  const port = await listen(app, startPort)
  ctx.logger.info(`Server runing at http://${opts.server.host}:${port}`)
}

module.exports = start
