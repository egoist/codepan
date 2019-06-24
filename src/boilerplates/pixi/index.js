export default async () => {
  const [htmlCode, jsCode] = await Promise.all([
    import('!raw-loader!./codepan.html'),
    import('!raw-loader!./codepan.js')
  ])

  return {
    js: {
      code: jsCode,
      transformer: 'js'
    },
    html: {
      code: htmlCode,
      transformer: 'html'
    },
    showPans: ['js', 'output']
  }
}
