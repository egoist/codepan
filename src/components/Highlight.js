import highlight from 'cm-highlight'

export default {
  name: 'highlight',
  functional: true,
  render(h, ctx) {
    const { theme = 'default', mode = 'javascript' } = ctx.props
    const code = highlight(ctx.props.code || ctx.children[0].text, { mode })
    return <pre style="margin:0" class={`cm-s-${theme}`}><code domProps-innerHTML={code}></code></pre>
  }
}
