const nodeModules = require('webpack-node-modules')

const BABEL_CDN = 'https://cdn.jsdelivr.net/npm/babel-standalone@7.0.0-alpha.15/babel.min.js'

module.exports = {
  extendWebpack(config) {
    config.module.noParse
      .add(/babel-standalone/)
      .add(/browserified-pug/)
      .add(/babel-preset-vue/)

    config.module.rule('js')
      .include
      .add(nodeModules())
  },
  production: {
    sourceMap: false
  },
  homepage: '/',
  env: {
    BABEL_CDN
  },
  presets: [
    require('poi-preset-bundle-report')(),
    require('poi-preset-offline')({
      pluginOptions: {
        version: '[hash]',
        autoUpdate: true,
        safeToUseOptionalCaches: true,
        caches: {
          main: ['index.html', 'client.*.*', 'vendor.*.*', 'editor-page.*.chunk.js'],
          additional: ['*.chunk.js', ':externals:'],
          optional: [':rest:']
        },
        ServiceWorker: {
          events: true,
          navigateFallbackURL: '/'
        },
        AppCache: {
          events: true,
          FALLBACK: { '/': '/' }
        },
        externals: [
          'https://reasonml.github.io/bs.js',
          'https://reasonml.github.io/refmt.js',
          BABEL_CDN
        ]
      }
    })
  ]
}
