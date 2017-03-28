import progress from 'nprogress'

let babel // eslint-disable-line import/no-mutable-exports

async function loadBabel() {
  progress.start()
  babel = await import('babel-standalone')
  progress.done()
}

export {
  babel,
  loadBabel
}
