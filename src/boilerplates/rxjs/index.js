export default async () => {
  const [htmlCode, jsCode] = await Promise.all([
    import('!raw-loader!./codepan.html'),
    import('!raw-loader!./codepan.js')
  ])

  return {
    js: {
      code: jsCode,
      transformer: 'JavaScript'
    },
    html: {
      code: htmlCode,
      transformer: 'HTML'
    },
    showPans: ['html', 'js', 'console']
  }
}
