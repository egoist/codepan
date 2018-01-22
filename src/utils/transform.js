import { transformers } from '@/utils/transformer'

const defaultPresets = [
  [
    'es2015',
    {
      modules: false
    }
  ],
  'es2016',
  'es2017',
  'stage-0'
]

export async function js({ code, transformer }) {
  if (transformer === 'js') {
    return code
  } else if (
    transformer === 'babel' ||
    transformer === 'jsx' /* @deprecated, use "babel" */
  ) {
    return window.Babel.transform(code, {
      presets: [...defaultPresets, 'flow', 'react']
    }).code
  } else if (transformer === 'typescript') {
    return window.Babel.transform(code, {
      presets: [...defaultPresets, 'typescript', 'react']
    }).code
  } else if (transformer === 'vue-jsx') {
    return window.Babel.transform(code, {
      presets: [...defaultPresets, 'flow', transformers.get('VuePreset')]
    }).code.replace(
      /import [^\s]+ from ['"]babel-helper-vue-jsx-merge-props['"];?/,
      transformers.get('VueJSXMergeProps')
    )
  } else if (transformer === 'svelte') {
    return (
      'var SvelteShadowComponent = ' +
      transformers.get('svelte').compile(code, {
        format: 'eval'
      }).code +
      `\n\nnew SvelteShadowComponent({target: document.body})`
    )
  } else if (transformer === 'reason') {
    const wrapInExports = code =>
      `;(function(exports) {\n${code}\n})(window.exports = {})`

    try {
      const ocamlCode = window.printML(window.parseRE(code))
      const res = JSON.parse(window.ocaml.compile(ocamlCode))
      if (res.js_error_msg) return res.js_error_msg
      return wrapInExports(res.js_code)
    } catch (err) {
      console.log(err)
      return `${err.message}${
        err.location ? `\n${JSON.stringify(err.location, null, 2)}` : ''
      }`
    }
  } else if (transformer === 'coffeescript-2') {
    const esCode = window.CoffeeScript.compile(code)
    return window.Babel.transform(esCode, {
      presets: [...defaultPresets, 'react']
    }).code
  }
  throw new Error(`Unknow transformer: ${transformer}`)
}

export async function html({ code, transformer }) {
  if (transformer === 'html') {
    return code
  } else if (transformer === 'pug') {
    return window.pug.render(code)
  } else if (transformer === 'markdown') {
    return transformers.get('markdown')(code)
  }
  throw new Error(`Unknow transformer: ${transformer}`)
}

export async function css({ code, transformer }) {
  switch (transformer) {
    case 'css':
      return code
    case 'cssnext':
      return window
        .postcss([window.cssnext])
        .process(code)
        .then(res => res.css)
    case 'less':
      return transformers
        .get('less')
        .render(code)
        .then(res => res.css)
    case 'scss':
    case 'sass':
      return new Promise((resolve, reject) => {
        transformers.get('sass').compile(code, {
          indentedSyntax: transformer === 'sass'
        }, result => {
          if (result.status === 0) return resolve(result.text)
          reject(new Error(result.formatted))
        })
      })
    default:
      throw new Error(`Unknow transformer: ${transformer}`)
  }
}
