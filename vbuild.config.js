const OfflinePlugin = require('offline-plugin')

module.exports = options => ({
  extendWebpack(config) {
    // inject offline-plugin in production build
    if (options.mode === 'production') {
      config.plugin('offline')
        .use(OfflinePlugin, [{
          caches: {
            main: [':rest:']
          },
          ServiceWorker: {
            events: true
          },
          AppCache: {
            events: true
          }
        }])
    }
  },
  production: {
    sourceMap: false
  }
})
