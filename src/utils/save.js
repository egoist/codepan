import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import template from 'lodash.template'
import { transformers, loadPug, loadMarkdown } from '@/utils/transformer'
import store from '../store'
const state = store.state

function compiler(tpl, data) {
  const compiled = template(tpl)
  return compiled(data)
}

function transformHTML({ code, transformer }) {
  if (transformer === 'HTML') {
    return code
  }
  if (transformer === 'Pug') {
    return transformers.pug.render(code)
  }
  if (transformer === 'Markdown') {
    return transformers.markdown(code)
  }
}

export default async function save({
  inline = true
} = {}) {
  const needBabel = state.js.transformer !== 'JavaScript'
  if (!(state.html.code || state.js.code || state.css.code)) {
    return
  }
  if (state.html.transformer === 'Pug') {
    await loadPug()
  }
  if (state.html.transformer === 'Markdown') {
    await loadMarkdown()
  }
  const html = transformHTML(state.html)
  if (inline) {
    const singleFile = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <style>
  <%= css.code %>
  </style><% if (needBabel) { %>
  <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script><% } %>
  <title>codepan</title>
</head>
<body>
<%= html %>
<script<%= needBabel ? ' type="text/'+ js.transformer.toLowerCase() + '"' : ''%>>
<%= js.code %>
</script><% if (needBabel) { %>
<script>
  Babel.transformScriptTags()
</script><% } %>
</body>
</html>
    `
    const blob = new Blob([compiler(singleFile, { ...state, needBabel, html })], { type: 'text/plain;charset=utf-8' })
    return saveAs(blob, `index-${Date.now()}.html`, true)
  }
  const zip = new JSZip()
  const htmlTpl = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link href="./style.css" rel="stylesheet"><% if (needBabel) { %>
  <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script><% } %>
  <title>codepan</title>
</head>
<body>
<%= html %>
<script src="./bundle.js"<%= needBabel ? ' type="text/'+ js.transformer.toLowerCase() + '"' : ''%>></script><% if (needBabel) { %>
<script>
  Babel.transformScriptTags()
</script><% } %>
</body>
</html>
  `
  zip.file('index.html', compiler(htmlTpl, { ...state, needBabel, html }))
  zip.file('bundle.js', state.js.code)
  zip.file('style.css', state.css.code)
  const content = await zip.generateAsync({ type: 'blob' })
  return saveAs(content, `codepan-${Date.now()}.zip`)
}
