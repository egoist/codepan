const nodeModules = require('webpack-node-modules')
const repoLatestCommit = require('repo-latest-commit')
const pkg = require('./package')

const cdns = {
  BABEL_CDN: 'https://cdn.jsdelivr.net/npm/@babel/standalone@7.0.0-beta.32/babel.min.js',
  PUG_CDN: 'https://cdn.jsdelivr.net/npm/browserified-pug@0.3.0/index.js',
  CSSNEXT_CDN: 'https://cdn.jsdelivr.net/npm/browserified-postcss-cssnext@0.3.0/index.js',
  POSTCSS_CDN: 'https://cdn.jsdelivr.net/npm/browserified-postcss@0.3.0/index.js',
  TYPESCRIPT_CDN: 'https://cdn.jsdelivr.net/npm/browserified-typescript@0.3.0/index.js'
}

module.exports = {
  extendWebpack(config) {
    config.module.set('noParse', /babel-preset-vue/)

    config.module.rule('js')
      .include
      .add(nodeModules())

    config.node.set('fs', 'empty')

    config.externals({
      electron: 'commonjs electron'
    })
  },
  production: {
    sourceMap: false
  },
  hash: false,
  homepage: '/',
  env: Object.assign({
    VERSION: `v${pkg.version}-${repoLatestCommit().commit.slice(0, 7)}`,
    LATEST_COMMIT: repoLatestCommit().commit.slice(0, 7)
  }, cdns),
  presets: [
    require('poi-preset-bundle-report')(),
    require('poi-preset-babel-minify')(),
    require('poi-preset-offline')({
      pluginOptions: {
        version: '[hash]',
        autoUpdate: true,
        safeToUseOptionalCaches: true,
        caches: {
          main: ['index.html', 'client.*', 'vendor.*', 'editor-page.chunk.js'],
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
        externals: [].concat(Object.keys(cdns).reduce((res, name) => {
          return res.concat(cdns[name])
        }, []))
      }
    })
  ],
  babel: {
    babelrc: false,
    presets: [
      require.resolve('babel-preset-poi')
    ],
    plugins: [[require.resolve('babel-plugin-component'), [
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]]]
  }
}
