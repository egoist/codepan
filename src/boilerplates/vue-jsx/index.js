export default async () => {
  const [htmlCode, jsCode, cssCode] = await Promise.all([
    import(/* webpackChunkName: "boilerplate-vue-jsx" */ '!raw-loader!./codepan.html'),
    import(/* webpackChunkName: "boilerplate-vue-jsx" */'!raw-loader!./codepan.js'),
    import(/* webpackChunkName: "boilerplate-vue-jsx" */'!raw-loader!./codepan.css')
  ])

  return {
    js: {
      code: jsCode,
      transformer: 'Vue JSX'
    },
    html: {
      code: htmlCode,
      transformer: 'HTML'
    },
    css: {
      code: cssCode,
      transformer: 'CSS'
    },
    showPans: ['html', 'js', 'output']
  }
}
