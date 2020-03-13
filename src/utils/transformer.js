// eslint-disable import/no-mutable-exports
import progress from 'nprogress'
import loadjs from 'loadjs'
import pify from 'pify'

function asyncLoad(resources, name) {
  return new Promise((resolve, reject) => {
    if (loadjs.isDefined(name)) {
      resolve()
    } else {
      loadjs(resources, name, {
        success() {
          resolve()
        },
        error() {
          progress.done()
          reject(new Error('network error'))
        }
      })
    }
  })
}

class Transformers {
  constructor() {
    this.map = {}
  }

  set(k, v) {
    this.map[k] = v
  }

  get(k) {
    return this.map[k]
  }
}

const transformers = new Transformers()

async function loadBabel() {
  if (loadjs.isDefined('babel')) return

  progress.start()
  const [, VuePreset, VueJSXMergeProps] = await Promise.all([
    asyncLoad(process.env.BABEL_CDN, 'babel'),
    import(/* webpackChunkName: "babel-stuffs" */ 'babel-preset-vue/dist/babel-preset-vue'), // use umd bundle since we don't want to parse `require`
    import(/* webpackChunkName: "babel-stuffs" */ '!raw-loader!./vue-jsx-merge-props')
  ])
  transformers.set('VuePreset', VuePreset)
  transformers.set('VueJSXMergeProps', VueJSXMergeProps)
  progress.done()
}

async function loadPug() {
  if (loadjs.isDefined('pug')) return

  progress.start()
  await Promise.all([
    asyncLoad(process.env.PUG_CDN, 'pug'),
    import(/* webpackChunkName: "codemirror-mode-pug" */ 'codemirror/mode/pug/pug')
  ])
  progress.done()
}

async function loadMarkdown() {
  if (!transformers.get('markdown')) {
    progress.start()
    const [marked] = await Promise.all([
      import('marked3').then(m => m.default),
      import('codemirror/mode/markdown/markdown')
    ])
    transformers.set('markdown', marked)
    progress.done()
  }
}

async function loadRust() {
  if (!transformers.get('rust')) {
    progress.start()
    await import('codemirror/mode/rust/rust')
    transformers.set('rust', true)
    progress.done()
  }
}

async function loadReason() {
  if (loadjs.isDefined('reason')) return

  progress.start()
  await asyncLoad(['/vendor/reason/bs.js', '/vendor/reason/refmt.js'], 'reason')
  progress.done()
}

async function loadCoffeeScript2() {
  if (loadjs.isDefined('coffeescript-2')) return

  progress.start()
  await Promise.all([
    asyncLoad(
      [
        '/vendor/coffeescript-2.js',
        // Need babel to transform JSX
        process.env.BABEL_CDN
      ],
      'coffeescript-2'
    ),
    import('codemirror/mode/coffeescript/coffeescript')
  ])
  progress.done()
}

async function loadCssnext() {
  if (loadjs.isDefined('cssnext')) return

  progress.start()
  await asyncLoad([process.env.CSSNEXT_CDN, process.env.POSTCSS_CDN], 'cssnext')
  progress.done()
}

async function loadLess() {
  if (!transformers.get('less')) {
    progress.start()
    const less = await import('less')
    transformers.set('less', pify(less))
    progress.done()
  }
}

async function loadSass() {
  if (!transformers.get('sass')) {
    progress.start()
    const [Sass] = await Promise.all([
      import('../../static/vendor/sass/sass'),
      import(/* webpackChunkName: "codemirror-mode" */ 'codemirror/mode/sass/sass.js')
    ])
    Sass.setWorkerUrl('/vendor/sass/sass.worker.js')
    transformers.set('sass', new Sass())
    progress.done()
  }
}

async function loadTypescript() {
  if (loadjs.isDefined('typescript')) return

  progress.start()
  await asyncLoad([process.env.TYPESCRIPT_CDN], 'typescript')
  progress.done()
}

async function loadStylus() {
  if (loadjs.isDefined('stylus')) return

  progress.start()
  await Promise.all([
    import(/* webpackChunkName: "codemirror-mode" */ 'codemirror/mode/stylus/stylus'),
    asyncLoad('/vendor/stylus.js', 'stylus')
  ])
  progress.done()
}

export {
  loadBabel,
  loadPug,
  loadMarkdown,
  transformers,
  loadReason,
  loadCoffeeScript2,
  loadCssnext,
  loadLess,
  loadSass,
  loadRust,
  loadTypescript,
  loadStylus
}
