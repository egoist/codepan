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
    css: 'CSS'
  }

  return names[transformer] || transformer
}
