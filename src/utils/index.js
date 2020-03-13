export function hasNextPan(pans, pan) {
  return pans.length - 1 > pans.indexOf(pan)
}

export const getHumanlizedTransformerName = transformer => {
  const names = {
    html: 'HTML',
    pug: 'Pug',
    markdown: 'Markdown',
    js: 'JavaScript',
    'vue-jsx': 'Vue JSX',
    babel: 'Babel',
    jsx: 'JSX', // @deprecated, use "babel"
    css: 'CSS',
    reason: 'Reason',
    'coffeescript-2': 'CoffeeScript 2',
    cssnext: 'cssnext',
    less: 'LESS',
    typescript: 'TypeScript',
    sass: 'SASS',
    scss: 'SCSS',
    rust: 'Rust',
    stylus: 'Stylus'
  }

  return names[transformer] || transformer
}

export const getEditorModeByTransfomer = transformer => {
  const modes = {
    html: 'htmlmixed',
    pug: 'pug',
    markdown: 'markdown',
    js: 'jsx',
    'vue-jsx': 'jsx',
    babel: 'jsx',
    jsx: 'jsx', // @deprecated, use "babel"
    css: 'css',
    reason: 'mllike',
    'coffeescript-2': 'coffeescript',
    cssnext: 'css',
    less: 'text/x-less',
    typescript: 'text/typescript',
    sass: 'text/x-sass',
    scss: 'text/x-scss',
    rust: 'rust',
    stylus: 'text/x-styl'
  }
  return modes[transformer]
}

export const inIframe = window.self !== window.top
