// eslint-disable import/no-mutable-exports
import progress from 'nprogress'

const transformers = {}

async function loadBabel() {
  if (transformers.babel) {
    progress.start()
    transformers.babel = await import('babel-standalone')
    progress.done()
  }
}

async function loadPug() {
  if (!transformers.pug) {
    progress.start()
    const res = await Promise.all([
      import('browserified-pug'),
      import('codemirror/mode/pug/pug')
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
