module.exports = {
  extendWebpack(config) {
    config.module.noParse
      .add(/babel-standalone/)
      .add(/browserified-pug/)
      .add(/babel-preset-vue/)
  },
  production: {
    sourceMap: false
  },
  homepage: '/',
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
          events: true
        },
        AppCache: {
          events: true
        }
      }
    })
  ]
}
