// eslint-disable import/no-mutable-exports
import progress from 'nprogress'

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
  if (!transformers.get('babel')) {
    progress.start()
    const [babel, VuePreset] = await Promise.all([
      import(/* webpackChunkName: "babel-stuffs" */ 'babel-standalone'),
      import(/* webpackChunkName: "babel-stuffs" */ 'babel-preset-vue/dist/babel-preset-vue') // use umd bundle since we don't want to parse `require`
    ])
    transformers.set('babel', babel)
    transformers.set('VuePreset', VuePreset)
    progress.done()
  }
}

async function loadPug() {
  if (!transformers.get('pug')) {
    progress.start()
    const res = await Promise.all([
      import('browserified-pug'),
      import(/* webpackChunkName: "codemirror-mode-pug" */ 'codemirror/mode/pug/pug')
    ])
    transformers.set('pug', res[0])
    progress.done()
  }
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

async function loadSvelte() {
  if (!transformers.get('svelte')) {
    progress.start()
    const svelte = await import('svelte')
    transformers.set('svelte', svelte)
    progress.done()
  }
}

export { loadBabel, loadPug, loadMarkdown, transformers, loadSvelte }
