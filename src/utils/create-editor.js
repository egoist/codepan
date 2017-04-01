/* eslint-disable import/no-unassigned-import */
import CodeMirror from 'codemirror'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/css/css'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'

import emmet, { setup as emmetSetup } from 'emmet-codemirror'
emmetSetup(CodeMirror)

export default function (el, opts = {}) {
  const editor = CodeMirror.fromTextArea(el, {
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: true,
    matchTags: { bothTags: true },
    matchBrackets: true,
    ...opts
  })

  editor.setOption('extraKeys', {
    Tab(cm) {
      const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
      cm.replaceSelection(spaces)
    }
  })

  if (opts.mode === 'htmlmixed') {
    emmet(editor)
  }

  return editor
}
