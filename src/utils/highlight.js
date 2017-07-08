import CodeMirror from 'codemirror'
import 'codemirror/addon/runmode/runmode'

CodeMirror.highlight = function (string, options = {}) {
  let html = ''
  let col = 0
  const tabSize = options.tabSize || 2

  CodeMirror.runMode(string, options.mode, (text, style) => {
    if (text === '\n') {
      html += '\n'
      col = 0
      return
    }

    let content = ''

    // replace tabs
    for (let pos = 0; ;) {
      const idx = text.indexOf('\t', pos)
      if (idx === -1) {
        content += text.slice(pos)
        col += text.length - pos
        break
      } else {
        col += idx - pos
        content += text.slice(pos, idx)
        const size = tabSize - (col % tabSize)
        col += size
        for (let i = 0; i < size; ++i) content += ' '
        pos = idx + 1
      }
    }

    if (style) {
      const className = 'cm-' + style.replace(/ +/g, 'cm-')
      content = `<span class="${className}">${content}</span>`
    }
    html += content
  })

  return html
}
