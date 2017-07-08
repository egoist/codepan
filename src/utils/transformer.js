// eslint-disable import/no-mutable-exports
import progress from 'nprogress'

const transformers = {}

async function loadBabel() {
  if (!transformers.babel) {
    progress.start()
    const [babel, VuePreset] = await Promise.all([
      import(/* webpackChunkName: "babel-stuffs" */ 'babel-standalone'),
      import(/* webpackChunkName: "babel-stuffs" */ 'babel-preset-vue')
    ])
    transformers.babel = babel
    transformers.VuePreset = VuePreset
    progress.done()
  }
}

async function loadPug() {
  if (!transformers.pug) {
    progress.start()
    const res = await Promise.all([
      import('browserified-pug'),
      import(/* webpackChunkName: "codemirror-mode-pug" */ 'codemirror/mode/pug/pug')
    ])
    transformers.pug = res[0]
    progress.done()
  }
}

async function loadMarkdown() {
  if (!transformers.markdown) {
    progress.start()
    const [marked] = await Promise.all([
      import('marked'),
      import('codemirror/mode/markdown/markdown')
    ])
    transformers.markdown = marked
    progress.done()
  }
}

export {
  loadBabel,
  loadPug,
  loadMarkdown,
  transformers
}
