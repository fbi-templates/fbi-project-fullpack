const targets = {
  browsers: ['last 2 versions', 'safari >= 7', 'ie > 8']
}

const options = {
  // Base options

  // Global constants used at compile time. according to the environment
  // Access in js   file: {name}
  // Access in html file: htmlWebpackPlugin.options.data.{name}
  data: {
    // all environment
    all: {
      CDN: './',
      VERSION: 'v2.1.2',
      COPYRIGHT: '@2018'
    },
    // `fbi s`
    dev: {
      API_ROOT: '/api-root'
    },
    // `fbi b -t`
    test: {
      API_ROOT: 'https://api.github.com'
    },
    // `fbi b` or `fbi b -p`
    prod: {
      API_ROOT: 'https://api.github.com'
    },
    // More customized environments...
    // `fbi b -eg`
    eg: {}
  },

  // Http proxy for development
  // https://github.com/vagusX/koa-proxies/blob/master/examples/server.js#L11
  // https://github.com/nodejitsu/node-http-proxy#options
  proxy: {
    '/api-root': 'https://api.github.com'
  },

  // Paths mapping
  mapping: {
    // Project root
    root: '.',

    src: 'src',
    dist: 'dist',
    // Static path (Relative root directory). This directory will be copied to dist.
    extra: 'static',

    templates: {
      src: '.',
      dist: '.',
      handlebars: {
        partials: 'templates/partials',
        helpers: 'templates/helpers'
      }
    },

    styles: {
      src: 'styles',
      dist: 'css'
    },

    scripts: {
      src: 'scripts',
      dist: 'js',
      workersDist: 'js/workers/',
      // Common js files. Will be bundle as common file, no need to require them manually.
      vendors: 'scripts/common/'
    },

    images: {
      src: 'images',
      dist: 'img'
    },

    fonts: {
      src: 'fonts',
      dist: 'fonts'
    },

    media: {
      src: 'media',
      dist: 'media'
    }
  },

  // server config
  server: {
    host: 'localhost',
    port: 8888
  },

  // Advanced

  // Webpack config
  webpack: {
    target: 'web',
    // Hot module replacement
    hot: true,
    // Hash versioning
    hash: true,
    cache: true,
    // Inline css & js
    inlineAssets: false,
    // Commons chunk
    commons: 'vendor',
    // Byte limit to inline files as Data URL
    assetsSizeLimit: 10000, // default: 10000
    // For LimitChunkCountPlugin: https://doc.webpack-china.org/plugins/limit-chunk-count-plugin
    maxChunks: 3, // >= 1, default: 10
    minChunkSize: 10000, // default: 10000
    externals: [],
    alias: {},
    // Webpack module noParse
    // Docs: https://webpack.js.org/configuration/module/#module-noparse
    noParse: content => {
      return false
    },
    // File content banner (Only valid in js and css files)
    banner: '',
    sourcemap: 'cheap-module-source-map',
    format: {
      hash: '[hash:6]',
      chunkhash: '[chunkhash:6]',
      contenthash: '[contenthash:6]'
    }
  },

  // Code lint config
  lint: {
    scripts: {
      enable: true,
      options: {
        // http://eslint.org/docs/user-guide/configuring
        // https://github.com/airbnb/javascript
        // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base
        rules: {
          semi: [2, 'never'],
          'comma-dangle': [2, 'never'],
          'no-console': [0],
          'no-param-reassign': [0] // https://github.com/airbnb/javascript#functions--mutate-params
        }
      }
    },
    styles: {
      enable: true,
      options: {
        // https://github.com/stylelint/stylelint-config-standard
        extends: 'stylelint-config-standard',
        // Docs: http://stylelint.io/user-guide/rules/
        // Example: http://stylelint.io/user-guide/example-config/
        rules: {}
      }
    }
  },

  // Minify on production
  minify: {
    templates: {
      enable: true,
      // Docs: https://github.com/kangax/html-minifier#options-quick-reference
      options: {
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    },
    scripts: {
      enable: true,
      // https://github.com/webpack-contrib/uglifyjs-webpack-plugin/#options
      options: {
        cache: true,
        uglifyOptions: {
          ecma: 8
        }
      }
    },
    styles: {
      enable: true,
      // http://cssnano.co/guides/presets/#how-do-presets-work
      options: {}
    }
  },

  // Bulild config
  templates: {
    // Template engine name, e.g.: handlebars/hbs: use handlebars; '' : use html
    template: 'handlebars'
  },

  // babel-loader options
  // https://babeljs.io/docs/usage/api/#options
  // https://github.com/babel/babel-loader#options
  scripts: {
    babelrc: false,
    cacheDirectory: true,
    presets: [
      [
        // https://github.com/babel/babel/tree/master/packages/babel-preset-env#options
        '@babel/preset-env',
        {
          targets,
          useBuiltIns: 'usage',
          debug: true
        }
      ]
    ]
  },

  // https://github.com/postcss/postcss-loader#options
  styles: {
    // plugins: {
    //   plugin-name: plugin-options
    // }
    plugins: {
      // https://github.com/postcss/postcss-reporter#options
      'postcss-reporter': {
        clearReportedMessages: true,
        clearAllMessages: true
      },

      // https://github.com/postcss/autoprefixer#options
      // https://github.com/ai/browserslist#queries
      autoprefixer: targets,

      // https://github.com/jonathantneal/precss/wiki/Options#precss-options
      precss: {}
    }
  },

  // Directories to copy
  // https://github.com/webpack-contrib/copy-webpack-plugin#usage
  copy: [
    {
      from: 'static',
      to: '.',
      ignore: []
    }
  ]
}

module.exports = options
