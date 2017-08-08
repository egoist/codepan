import { transformers } from '@/utils/transformer'

export function js({ code, transformer }) {
  if (transformer === 'js') {
    return code
  } else if (transformer === 'babel') {
    return window.Babel.transform(code, {
      presets: ['es2015', 'stage-2', transformers.get('FlowPreset')],
      plugins: ['transform-react-jsx']
    }).code
  } else if (transformer === 'jsx') {
    return window.Babel.transform(code, {
      presets: ['stage-2', transformers.get('FlowPreset')],
      plugins: ['transform-react-jsx']
    }).code
  } else if (transformer === 'vue-jsx') {
    return window.Babel
      .transform(code, {
        presets: [
          'stage-2',
          transformers.get('VuePreset'),
          transformers.get('FlowPreset')
        ]
      })
      .code.replace(
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

    const converted = window.refmt(code, 'RE', 'implementation', 'ML')
    if (converted[0] === 'REtoML') {
      const res = JSON.parse(window.ocaml.compile(converted[1]))
      if (res.js_code) {
        return wrapInExports(res.js_code)
      }
      throw new Error(res.js_error_msg)
    } else {
      throw new Error(converted[1])
    }
  }
  throw new Error(`Unknow transformer: ${transformer}`)
}

export function html({ code, transformer }) {
  if (transformer === 'html') {
    return code
  } else if (transformer === 'pug') {
    return transformers.get('pug').render(code)
  } else if (transformer === 'markdown') {
    return transformers.get('markdown')(code)
  }
  throw new Error(`Unknow transformer: ${transformer}`)
}
