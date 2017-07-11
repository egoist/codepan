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
