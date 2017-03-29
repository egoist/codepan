export default async () => {
  const [htmlCode, jsCode] = await Promise.all([
    import('!raw-loader!@/boilerplates/react/codepan.html'),
    import('!raw-loader!@/boilerplates/react/codepan.js')
  ])

  return {
    html: {
      code: htmlCode,
      transformer: 'HTML'
    },
    js: {
      code: jsCode,
      transformer: 'JSX'
    },
    showPans: ['html', 'js', 'output']
  }
}
