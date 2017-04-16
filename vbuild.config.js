const OfflinePlugin = require('offline-plugin')

module.exports = options => ({
  postcss: [
    // add more postcss plugins here
    // by default we have autoprefixer pre added
    require('postcss-nested'),
    require('postcss-property-lookup')
  ],
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
