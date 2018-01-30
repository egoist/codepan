export default async () => {
  const jsCode = await import('!raw-loader!./codepan.js')

  return {
    js: {
      code: jsCode,
      transformer: 'babel'
    },
    showPans: ['js', 'console']
  }
}
