export default async () => {
  const jsCode = await import('!raw-loader!./codepan.svelte')

  return {
    js: {
      code: jsCode,
      transformer: 'svelte'
    },
    showPans: ['js', 'output']
  }
}
