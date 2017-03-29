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
  import { babel } from '@/utils/transformer'
  import Event from '@/utils/event'
  import panPosition from '@/utils/pan-position'

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
      window.addEventListener('message', this.listenIframe)
      Event.$on('run', () => this.run())
      Event.$on('refresh-editor', () => this.run())
    },
    beforeDestroy() {
      window.removeEventListener('message', this.listenIframe)
    },
    methods: {
      ...mapActions(['addLog', 'clearLogs', 'setHighlightPan']),
      listenIframe({ data = {} }) {
        if (data.type === 'iframe-error') {
          this.addLog({ type: 'error', message: data.message.trim() })
        } else if (data.type === 'iframe-log') {
          this.addLog({ type: 'log', message: data.message })
        } else if (data.type === 'codepan-clear-logs') {
          this.clearLogs()
        } else if (data.type === 'codepan-highlight-output') {
          this.setHighlightPan('output')
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
            ${this.transformJS(this.js.code)}
          };`
        } catch (err) {
          return this.addLog({ type: 'error', message: err.message })
        }

        html = this.html.code // eslint-disable-line prefer-const
        css = this.css.code // eslint-disable-line prefer-const

        const ourJS = `
        window.onerror = function (message) {
          window.parent.postMessage({ type: 'iframe-error', message: message  }, '*')
          return false
        }
        window.addEventListener('unhandledrejection', function (e) {
          window.parent.postMessage({ type: 'iframe-error', message: e.reason.stack  }, '*')
        });
        window.addEventListener('click', function () {
          window.parent.postMessage({ type: 'codepan-highlight-output' }, '*')
        })
        ;(function () {
          var _log = console.log;
          var _error = console.error
          function report(type, arguments) {
            var msg = [].slice.call(arguments).map(JSON.stringify).join('\\n')
            window.parent.postMessage({ type: 'iframe-' + type, message: msg}, '*')
          }
          console.log = function () {
            report('log', arguments)
            _log.apply(null, arguments)
          }
          console.error = function () {
            report('error', arguments)
            _error.apply(null, arguments)
          }
          console.clear = function () {
            window.parent.postMessage({ type: 'codepan-clear-logs' }, '*')
          }
        })();
        `

        const output = `${html}&lt;style>${css}&lt;/style>&lt;script>${ourJS}&lt;/script>&lt;script>${js}&lt;/script>`.replace(/&lt;/g, '<')

        const newIframe = document.createElement('iframe')
        newIframe.id = 'output-iframe'
        newIframe.className = 'output-iframe'
        newIframe.frameBorder = '0'

        const oldIframe = document.getElementById('output-iframe')
        oldIframe.parentNode.replaceChild(newIframe, oldIframe)

        const doc = newIframe.contentWindow.document
        doc.open().write(output)
        doc.close()
      },
      transformJS(source) {
        if (this.js.transformer === 'JavaScript') {
          return source
        }
        if (this.js.transformer === 'Babel') {
          return babel.transform(source, {
            presets: ['es2015', 'stage-2'],
            plugins: ['transform-react-jsx']
          }).code
        }
        if (this.js.transformer === 'JSX') {
          return babel.transform(source, {
            presets: ['stage-2'],
            plugins: ['transform-react-jsx']
          }).code
        }

        console.error('Unknow transformer!')
      }
    }
  }
</script>

<style>
  .output-iframe {
    width: 100%;
    height: 100%;
    &.disable-mouse-events {
      pointer-events: none;
    }
  }
</style>
