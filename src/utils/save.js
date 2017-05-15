import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import template from 'lodash.template'
import store from '../store'
const state = store.state

function compiler(tpl, data) {
  const compiled = template(tpl)
  return compiled(data)
}

export default async function save({
  inline = true
} = {}) {
  const needBabel = state.js.transformer !== 'JavaScript'
  if (!(state.html.code || state.js.code || state.css.code)) {
    return
  }
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
<%= html.code %>
<script<%= needBabel ? ' type="text/'+ js.transformer.toLowerCase() + '"' : ''%>>
<%= js.code %>
</script><% if (needBabel) { %>
<script>
  Babel.transformScriptTags()
</script><% } %>
</body>
</html>
    `
    const blob = new Blob([compiler(singleFile, { ...state, needBabel })], { type: 'text/plain;charset=utf-8' })
    return saveAs(blob, `index-${Date.now()}.html`, true)
  }
  const zip = new JSZip()
  const html = `
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
<%= html.code %>
<script src="./bundle.js"<%= needBabel ? ' type="text/'+ js.transformer.toLowerCase() + '"' : ''%>></script><% if (needBabel) { %>
<script>
  Babel.transformScriptTags()
</script><% } %>
</body>
</html>
  `
  zip.file('index.html', compiler(html, { ...state, needBabel }))
  zip.file('bundle.js', state.js.code)
  zip.file('style.css', state.css.code)
  const content = await zip.generateAsync({ type: 'blob' })
  return saveAs(content, `codepan-${Date.now()}.zip`)
}
