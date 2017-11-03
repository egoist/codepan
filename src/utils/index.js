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
    jsx: 'JSX',
    css: 'CSS',
    svelte: 'Svelte',
    reason: 'Reason',
    'coffeescript-2': 'CoffeeScript 2',
    cssnext: 'cssnext',
    less: 'Less'
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
    jsx: 'jsx',
    css: 'css',
    svelte: 'htmlmixed',
    reason: 'mllike',
    'coffeescript-2': 'coffeescript',
    cssnext: 'css',
    less: 'text/x-less'
  }
  return modes[transformer]
}
