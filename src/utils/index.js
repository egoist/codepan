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
    svelte: 'Svelte',
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
    svelte: 'htmlmixed',
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

export function getUrlParams() {
  return location.href
    .split(/[?&]/)
    .slice(1)
    .reduce((carry, pair) => {
      const parts = pair.split('=')
      if (parts[0] || parts[1])
        Object.assign(carry, { [parts[0]]: parts[1].split('#')[0] })
      return carry
    }, {})
}

export function createUrlBase() {
  const index = location.href.indexOf('?')
  return index === -1 ? location.href : location.href.substr(0, index)
}

export function createUrlParams(urlParams, state) {
  return Object.entries(
    Object.assign({}, urlParams, { pans: state.visiblePans.join(',') })
  )
    .reduce((carry, [key, value]) => {
      value && carry.push(`${key}=${value}`)
      return carry
    }, []).join('&')
}

export function createElement(tag, content = '', attrs = {}) {
  const element = document.createElement(tag)
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value))
  element.innerHTML = content

  return element
}

export function createElementHTML(tag, content = '', attrs = {}) {
  return createElement(tag, content, attrs).outerHTML
}
