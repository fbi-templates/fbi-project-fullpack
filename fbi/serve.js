const http = require('http')
const path = require('path')
const Koa = require('koa')
const koaStatic = require('koa-static')
const webpack = require('webpack')
const proxy = require('koa-proxies')
const koaWebpack = require('koa-webpack')
const globby = require('globby')
const statsConfig = require('./config/stats')

// Set env
ctx.env = require('./helpers/get-env')('serve')
ctx.noop = function () {}

const makeWebpackConfig = require('./config/webpack')
const opts = ctx.options

async function generatePageIndex (htmlEntries) {
  let list = ''
  const tmpl = await ctx.utils.fs.read(
    path.join(__dirname, './templates/list.html')
  )

  htmlEntries.map(html => {
    list += `<div class="item"><a href="./${html}">${html}</a></div>`
  })

  return tmpl.replace('{{list}}', list)
}

async function server (app, serverInstance) {
  const { webpackConfigs, htmlEntries } = await makeWebpackConfig(opts, 'dev')

  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfigs)
    koaWebpack({
      compiler,
      devMiddleware: {
        publicPath: webpackConfigs.output.publicPath,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        watchOptions: {
          aggregateTimeout: 300,
          poll: true
        },
        logLevel: opts.webpack.logLevel,
        stats: statsConfig
      },
      hotClient: opts.webpack.hot
        ? {
          allEntries: true,
          server: serverInstance,
          logLevel: opts.webpack.logLevel
        }
        : null
    }).then(middleware => {
      app.use(middleware)
      // app.use(koaStatic(opts.mapping.src || 'src'))

      app.use(async (_ctx, next) => {
        const filename = path.basename(_ctx.url)
        if (!filename.trim() || _ctx.url.startsWith('/__index')) {
          _ctx.body = await generatePageIndex(htmlEntries)
        }
        await next()
      })

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

      middleware.devMiddleware.waitUntilValid(() => resolve(app))
    })
  })
}

function listen (app, startPort) {
  return new Promise((resolve, reject) => {
    let port = startPort
    startPort += 1
    const server = http.createServer(app.callback())

    server.listen(port, err => {
      server.once('close', () => {
        app.listen(port, err => {
          return err
            ? reject(err)
            : resolve({
              port,
              server
            })
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

async function start () {
  const app = new Koa()
  let startPort = ctx.env.params.port >> 0 || opts.server.port
  const { port, serverInstance } = await listen(app, startPort)

  if (ctx.env.dist && ctx.env.name !== 'dev') {
    ctx.logger.log(`Server Root: ${ctx.env.dist}.`)
    if (await ctx.utils.fs.exist(ctx.env.dist)) {
      let htmlEntries = await globby(
        path.join(process.cwd(), ctx.env.dist, '*.html')
      )

      htmlEntries = htmlEntries.map(html =>
        path.relative(path.join(process.cwd(), ctx.env.dist), html)
      )

      app.use(async (_ctx, next) => {
        const filename = path.basename(_ctx.url)
        if (!filename.trim() || _ctx.url.startsWith('/__index')) {
          _ctx.body = await generatePageIndex(htmlEntries)
        }
        await next()
      })

      app.use(koaStatic(ctx.env.dist))
    } else {
      throw `Directory \`${ctx.env.dist}\` not exist.`
    }
  } else {
    await server(app, serverInstance)
  }

  const serverRoot = `http://${opts.server.host}:${port}`
  const PageIndex = `${serverRoot}/__index`
  ctx.logger.log(`Static Server: ${ctx.utils.style.cyan(serverRoot)}`)
  ctx.logger.log(`Page Index   : ${ctx.utils.style.cyan(PageIndex)}`)
}

module.exports = start
