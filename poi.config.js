const OfflinePlugin = require('offline-plugin')

module.exports = options => ({
  postcss: [require('postcss-nested'), require('postcss-property-lookup')],
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
          AppCache: {
            events: true
          },
          responseStrategy: 'network-first'
        }
      ])
    }
  },
  production: {
    sourceMap: false
  },
  presets: [require('poi-preset-bundle-report')()]
})
