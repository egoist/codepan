const OfflinePlugin = require('offline-plugin')

module.exports = options => ({
  entry: 'src/index.js',
  postcss: [
    // add more postcss plugins here
    // by default we have autoprefixer pre added
    require('postcss-nested'),
    require('postcss-property-lookup')
  ],
  webpack(config) {
    // inject offline-plugin in production build
    if (!options.dev) {
      config.plugins.push(new OfflinePlugin({
        caches: {
          main: [':rest:']
          // additional: [':externals:'],
        },
        ServiceWorker: {
          events: true
        },
        AppCache: {
          events: true
        }
      }))
    }

    config.node = {
      fs: 'empty'
    }

    return config
  },
  production: {
    sourceMap: false
  }
})
