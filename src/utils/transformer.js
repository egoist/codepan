// eslint-disable import/no-mutable-exports
import progress from 'nprogress'

let babel
let pug

async function loadBabel() {
  progress.start()
  babel = await import('babel-standalone')
  progress.done()
}

async function loadPug() {
  progress.start()
  const res = await Promise.all([
    import('browserified-pug'),
    import('codemirror/mode/pug/pug')
  ])
  pug = res[0]
  progress.done()
}

export {
  babel,
  loadBabel,
  pug,
  loadPug
}
