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
import 'codemirror/addon/comment/comment'

const isMac = CodeMirror.keyMap['default'] == CodeMirror.keyMap.macDefault

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
    },
    [isMac ? 'Cmd-/' : 'Ctrl-/'](cm) {
      cm.toggleComment()
    }
  })

  if (opts.mode === 'htmlmixed') {
    import('emmet-codemirror').then(emmet => {
      emmet.setup(CodeMirror)
      emmet.default(editor)
    })
  }

  return editor
}
