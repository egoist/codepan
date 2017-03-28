import progress from 'nprogress'

let babel

async function loadBabel() {
  progress.start()
  babel = await import('babel-standalone')
  progress.done()
}

export {
  babel,
  loadBabel
}
