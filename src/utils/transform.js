import { transformers } from '@/utils/transformer'

export function js({ code, transformer }) {
  if (transformer === 'js') {
    return code
  } else if (transformer === 'babel') {
    return transformers.get('babel').transform(code, {
      presets: ['es2015', 'stage-2'],
      plugins: ['transform-react-jsx']
    }).code
  } else if (transformer === 'jsx') {
    return transformers.get('babel').transform(code, {
      presets: ['stage-2'],
      plugins: ['transform-react-jsx']
    }).code
  } else if (transformer === 'vue-jsx') {
    return transformers.get('babel').transform(code, {
      presets: ['stage-2', transformers.get('VuePreset')]
    }).code
      .replace(/import [^\s]+ from ['"]babel-helper-vue-jsx-merge-props['"];?/, transformers.get('VueJSXMergeProps'))
  } else if (transformer === 'svelte') {
    return 'var SvelteShadowComponent = ' + transformers.get('svelte').compile(code, {
      format: 'eval'
    }).code + `\n\nnew SvelteShadowComponent({target: document.body})`
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
