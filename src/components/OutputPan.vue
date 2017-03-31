<template>
  <div
    class="output-pan"
    :class="{ 'highlight-pan': isHighlightPan }"
    @click="setHighlightPan('output')"
    :style="style">
    <div class="pan-head">
      Output
    </div>
    <div id="output-iframe" class="output-iframe"></div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import createIframe from 'iframe'
  import { transformers } from '@/utils/transformer'
  import Event from '@/utils/event'
  import panPosition from '@/utils/pan-position'
  import proxyConsole from '!raw-loader!uglify-loader!babel-loader!@/utils/proxy-console'

  const sandboxAttributes = ['allow-modals', 'allow-forms', 'allow-pointer-lock', 'allow-popups', 'allow-same-origin', 'allow-scripts']

  const replaceQuote = str => str.replace(/&lt;/g, '<')

  export default {
    name: 'output-pan',
    computed: {
      ...mapState(['js', 'css', 'html', 'visiblePans', 'highlightPan']),
      style() {
        return panPosition(this.visiblePans, 'output')
      },
      isHighlightPan() {
        return this.highlightPan === 'output'
      }
    },
    mounted() {
      this.iframe = createIframe({
        container: document.getElementById('output-iframe')
      })

      window.addEventListener('message', this.listenIframe)
      Event.$on('run', () => this.run())
      Event.$on('refresh-editor', () => this.run())
    },
    beforeDestroy() {
      window.removeEventListener('message', this.listenIframe)
    },
    methods: {
      ...mapActions(['addLog', 'clearLogs', 'setHighlightPan', 'setBoilerplate']),
      async listenIframe({ data = {} }) {
        if (data.type === 'iframe-error') {
          this.addLog({ type: 'error', message: data.message.trim() })
        } else if (data.type === 'codepan-console') {
          if (data.method === 'clear') {
            this.clearLogs()
          } else {
            this.addLog({ type: data.method, message: data.args.join('\\n') })
          }
        } else if (data.type === 'codepan-highlight-output') {
          this.setHighlightPan('output')
        } else if (data.type === 'codepan-set-boilerplate' && data.boilerplate) {
          await this.setBoilerplate(JSON.parse(data.boilerplate))
          Event.$emit('refresh-editor')
        }
      },
      run() {
        let js
        // We may add preprocessors supports for html/css in the future
        let html
        let css

        try {
          js = `
          document.addEventListener('DOMContentLoaded', __executeCodePan)
          function __executeCodePan(){
            ${this.transformJS(this.js)}
          };`
          html = this.transformHTML(this.html)
          css = this.css.code // eslint-disable-line prefer-const
        } catch (err) {
          return this.addLog({ type: 'error', message: err.message })
        }

        const head = replaceQuote(`&lt;style>${css}&lt;/style>`)
        const body = replaceQuote(`${html}&lt;script>${proxyConsole}&lt;/script>&lt;script>${js}&lt;/script>`)

        this.iframe.setHTML({
          head,
          body,
          sandboxAttributes
        })
      },
      transformJS({ code, transformer }) {
        if (transformer === 'JavaScript') {
          return code
        }
        if (transformer === 'Babel') {
          return transformers.babel.transform(code, {
            presets: ['es2015', 'stage-2'],
            plugins: ['transform-react-jsx']
          }).code
        }
        if (transformer === 'JSX') {
          return transformers.babel.transform(code, {
            presets: ['stage-2'],
            plugins: ['transform-react-jsx']
          }).code
        }

        console.error('Unknow transformer!')
      },
      transformHTML({ code, transformer }) {
        if (transformer === 'HTML') {
          return code
        }
        if (transformer === 'Pug') {
          return transformers.pug.render(code)
        }
        if (transformer === 'Markdown') {
          return transformers.markdown(code)
        }
      }
    }
  }
</script>

<style>
  .output-iframe {
    width: 100%;
    height: calc(100% - 40px);
    &.disable-mouse-events {
      pointer-events: none;
    }
  }
</style>
