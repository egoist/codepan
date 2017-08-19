/* eslint-disable import/no-unassigned-import */
import CodeMirror from 'codemirror'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/css/css'
import 'codemirror/mode/mllike/mllike'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/markdown-fold'
import 'codemirror/addon/fold/comment-fold'

const isMac = CodeMirror.keyMap.default === CodeMirror.keyMap.macDefault

export default function (el, opts = {}) {
  const editor = CodeMirror.fromTextArea(el, {
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: true,
    matchTags: { bothTags: true },
    matchBrackets: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    ...opts
  })

  editor.setOption('extraKeys', {
    ...editor.getOption('extraKeys'),
    Tab(cm) {
      // Indent, or place 2 spaces
      if (cm.somethingSelected()) {
        cm.indentSelection('add')
      } else if (cm.getOption('mode').indexOf('html') > -1) {
        try {
          cm.execCommand('emmetExpandAbbreviation')
        } catch (err) {
          console.error(err)
        }
      } else {
        const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
        cm.replaceSelection(spaces, 'end', '+input')
      }
    },
    [isMac ? 'Cmd-/' : 'Ctrl-/'](cm) {
      cm.toggleComment()
    }
  })

  editor.on('gutterClick', (cm, line, gutter) => {
    if (gutter === 'CodeMirror-linenumbers') {
      // eslint-disable-next-line new-cap
      return cm.setSelection(CodeMirror.Pos(line, 0), CodeMirror.Pos(line + 1, 0))
    }
  })

  import(/* webpackChunkName: "codemirror-emmet" */ 'codemirror-emmet').then(emmet => {
    emmet(CodeMirror)
    editor.setOption('extraKeys', {
      ...editor.getOption('extraKeys'),
      Enter: 'emmetInsertLineBreak'
    })
    editor.setOption('emmet', {
      markupSnippets: {
        'script:unpkg': 'script[src="https://unpkg.com/"]',
        'script:jsd': 'script[src="https://cdn.jsdelivr.net/npm/"]'
      }
    })
  })

  return editor
}
