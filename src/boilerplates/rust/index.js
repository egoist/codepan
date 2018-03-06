export default async () => {
  return {
    js: {
      code: await import('!raw-loader!./codepan.rs'),
      transformer: 'rust'
    },
    showPans: ['js', 'console']
  }
}
