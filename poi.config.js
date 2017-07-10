const OfflinePlugin = require('offline-plugin')

module.exports = options => ({
  extendWebpack(config) {
    config.module.noParse
      .add(/babel-standalone/)
      .add(/browserified-pug/)
      .add(/babel-preset-vue/)
    // inject offline-plugin in production build
    if (options.mode === 'production') {
      config.plugin('offline').use(OfflinePlugin, [
        {
          autoUpdate: true,
          caches: {
            main: [':rest:']
          },
          ServiceWorker: {
            events: true
          },
          AppCache: false
        }
      ])
    }
  },
  production: {
    sourceMap: false
  },
  presets: [require('poi-preset-bundle-report')()]
})
