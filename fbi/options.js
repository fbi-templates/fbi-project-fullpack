const targets = {
  browsers: ['last 2 versions', 'safari >= 7', 'ie > 8']
}

const banner = `
Project name - [description]

Author: [name]
Built: ${new Date().toLocaleString()} via fbi

Copyright @2017 [organization]`

module.exports = {
  // Paths mapping
  mapping: {
    src: 'src',
    dist: 'dist',
    // This directory is just copied when building
    static: 'static',
    html: {
      root: '.',
      partials: 'tmpl/partials',
      helpers: 'tmpl/helpers'
    },
    css: 'css',
    js: 'js',
    jsCommon: 'js/common/',
    img: 'img',
    fonts: 'fonts',
    media: 'media'
  },

  server: {
    host: 'localhost',
    port: 8888
  },

  // Global constants used at compile time
  // Usage:
  // in `js` file: {name}
  // in `html` file: htmlWebpackPlugin.options.data.{name}
  data: {
    all: {
      CDN: './',
      VERSION: 'v2.0.0',
      COPYRIGHT: '@2017'
    },
    dev: {
      CGI_ROOT: 'http://cgi.dev'
    },
    test: {
      CGI_ROOT: 'http://cgi.test'
    },
    prod: {
      CGI_ROOT: 'http://cgi.prod'
    },
    // More environments...
    as: {}
  },

  webpack: {
    // Template engine name
    tmpl: 'handlebars',
    // Hot module replacement
    hot: true,
    // Hash versioning
    hash: false,
    // Inline css & js
    inline: false,
    // Common js
    commons: 'common',
    // Compress the code
    compress: true,
    esnext: false,
    // Byte limit to inline files as Data URL
    limit: 10000,
    // For LimitChunkCountPlugin: https://doc.webpack-china.org/plugins/limit-chunk-count-plugin
    maxChunks: 3, // >= 1
    minChunkSize: 10000,

    externals: [],
    alias: {},
    // js css文件头部文案
    banner: banner
  },

  // Html compress
  htmlCompress: {
    status: 'on',
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

  // Postcss config
  postcss: {
    compress: true,
    plugins: {
      // (plugin-name: plugin-options)
      stylelint: {
        // https://github.com/stylelint/stylelint-config-standard
        extends: 'stylelint-config-standard',
        // Docs: http://stylelint.io/user-guide/rules/
        // Example: http://stylelint.io/user-guide/example-config/
        rules: {}
      },
      autoprefixer: targets,
      'postcss-reporter': {},
      precss: {}
    }
  },

  eslint: {
    status: 'on', // `on`: turn on; others: turn off
    options: {
      // http://eslint.org/docs/user-guide/configuring
      // https://github.com/airbnb/javascript
      // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base
      extends: 'airbnb-base',
      parser: 'babel-eslint',
      parserOptions: {
        ecmaVersion: 7,
        sourceType: 'module',
        allowImportExportEverywhere: false
      },
      rules: {
        semi: [2, 'never'], // 行尾不要使用分号
        'comma-dangle': [2, 'never'], // 对象最后一项 不使用逗号
        'no-console': [0], // 可以使用console
        'no-param-reassign': [0] // https://github.com/airbnb/javascript#functions--mutate-params
      }
    }
  }
}
