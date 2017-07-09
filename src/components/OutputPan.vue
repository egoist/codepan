<template>
  <div
    class="output-pan"
    :class="{ 'active-pan': isActivePan }"
    @click="setActivePan('output')"
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

  const replaceQuote = str => str.replace(/__QUOTE_LEFT__/g, '<')

  export default {
    name: 'output-pan',
    computed: {
      ...mapState(['js', 'css', 'html', 'visiblePans', 'activePan']),
      style() {
        return panPosition(this.visiblePans, 'output')
      },
      isActivePan() {
        return this.activePan === 'output'
      }
    },
    mounted() {
      this.iframe = createIframe({
        container: document.getElementById('output-iframe')
      })

      window.addEventListener('message', this.listenIframe)
      Event.$on('run', () => this.run())
      Event.$on('refresh-editor', ({
        run = true
      } = {}) => {
        run && this.run()
      })
    },
    beforeDestroy() {
      window.removeEventListener('message', this.listenIframe)
    },
    methods: {
      ...mapActions(['addLog', 'clearLogs', 'setActivePan', 'setBoilerplate']),
      async listenIframe({ data = {} }) {
        if (data.type === 'iframe-error') {
          this.addLog({ type: 'error', message: data.message.trim() })
        } else if (data.type === 'codepan-console') {
          if (data.method === 'clear') {
            this.clearLogs()
          } else {
            this.addLog({ type: data.method, message: data.args.join('\\n') })
          }
        } else if (data.type === 'codepan-make-output-active') {
          this.setActivePan('output')
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

        const head = replaceQuote(`__QUOTE_LEFT__style>${css}__QUOTE_LEFT__/style>`)
        const body = replaceQuote(`${html}__QUOTE_LEFT__script>${proxyConsole}__QUOTE_LEFT__/script>__QUOTE_LEFT__script>${js}__QUOTE_LEFT__/script>`)

        this.iframe.setHTML({
          head,
          body,
          sandboxAttributes
        })
      },
      transformJS({ code, transformer }) {
        if (transformer === 'js') {
          return code
        }
        if (transformer === 'babel') {
          return transformers.get('babel').transform(code, {
            presets: ['es2015', 'stage-2'],
            plugins: ['transform-react-jsx']
          }).code
        }
        if (transformer === 'jsx') {
          return transformers.get('babel').transform(code, {
            presets: ['stage-2'],
            plugins: ['transform-react-jsx']
          }).code
        }
        if (transformer === 'vue-jsx') {
          return transformers.get('babel').transform(code, {
            presets: ['stage-2', transformers.get('VuePreset')]
          }).code
        }

        console.error('Unknow transformer:', transformer)
      },
      transformHTML({ code, transformer }) {
        if (transformer === 'html') {
          return code
        }
        if (transformer === 'pug') {
          return transformers.get('pug').render(code)
        }
        if (transformer === 'markdown') {
          return transformers.get('markdown')(code)
        }
      }
    }
  }
</script>

<style scoped>
  .output-pan {
    overflow: hidden;
  }

  .output-iframe {
    width: 100%;
    height: calc(100% - 40px);
    &.disable-mouse-events {
      pointer-events: none;
    }
  }
</style>
