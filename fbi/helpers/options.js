const defaults = {
  data: {},
  proxy: {},
  mapping: {
    root: '.',
    src: 'src',
    dist: 'dist'
  },
  server: {
    host: 'localhost',
    port: 8888
  },
  webpack: {},
  lint: {
    scripts: {
      enable: true,
      options: {}
    },
    styles: {
      enable: true,
      options: {}
    }
  },
  copy: [],
  compress: {
    templates: {
      enable: true,
      options: {}
    },
    scripts: {
      enable: true,
      options: {}
    },
    styles: {
      enable: true,
      options: {}
    }
  },
  templates: {},
  scripts: {},
  styles: {}
}

module.exports = opts => Object.assign({}, defaults, opts)
