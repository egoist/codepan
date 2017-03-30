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
  pug = await import('browserified-pug')
  progress.done()
}

export {
  babel,
  loadBabel,
  pug,
  loadPug
}
