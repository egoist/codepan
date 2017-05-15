import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import store from '../store'

export default async function save({
  inline = true
} = {}) {
  const state = store.state

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
  ${state.css.code}
  </style>
  <title>codepan</title>
</head>
<body>
  ${state.html.code}
<script>
${state.js.code}
</script>
</body>
</html>
    `
    const blob = new Blob([singleFile], { type: 'text/plain;charset=utf-8' })
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
  <link href="style.css" rel="stylesheet">
  <title>codepan</title>
</head>
<body>
${state.html.code}
<script src="bundle.js"></script>
</body>
</html>
  `
  zip.file('index.html', html)
  zip.file('bundle.js', state.js.code)
  zip.file('style.css', state.css.code)
  const content = await zip.generateAsync({ type: 'blob' })
  return saveAs(content, `codepan-${Date.now()}`)
}
