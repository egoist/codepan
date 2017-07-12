<template>
  <div
    class="output-pan"
    :class="{ 'active-pan': isActivePan }"
    @click="setActivePan('output')"
    :style="style">
    <div class="pan-head">
      Output
      <spinner
        class="output-loading"
        :height="12"
        :line-width="1"
        v-if="iframeStatus === 'loading'">
      </spinner>
      <svg-icon
        v-else-if="iframeStatus"
        :name="iframeStatus"
        :class="`output-${iframeStatus}`">
      </svg-icon>
    </div>
    <div id="output-iframe" class="output-iframe"></div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import createIframe from '@/utils/iframe'
  import { transformers } from '@/utils/transformer'
  import Event from '@/utils/event'
  import panPosition from '@/utils/pan-position'
  import proxyConsole from '!raw-loader!babel-loader?presets[]=babili&-babelrc!buble-loader!@/utils/proxy-console'
  import SvgIcon from './SvgIcon.vue'
  import Spinner from './Spinner.vue'

  const sandboxAttributes = ['allow-modals', 'allow-forms', 'allow-pointer-lock', 'allow-popups', 'allow-same-origin', 'allow-scripts']

  const replaceQuote = str => str.replace(/__QUOTE_LEFT__/g, '<')

  const createElement = tag => content => replaceQuote(`__QUOTE_LEFT__${tag}>${content}__QUOTE_LEFT__/${tag}>`)

  export default {
    name: 'output-pan',
    data() {
      return {
        style: {},
        iframeStatus: null
      }
    },
    watch: {
      visiblePans: {
        immediate: true,
        handler(val) {
          this.style = panPosition(val, 'output')
        }
      }
    },
    computed: {
      ...mapState(['js', 'css', 'html', 'visiblePans', 'activePan']),
      isActivePan() {
        return this.activePan === 'output'
      }
    },
    mounted() {
      this.iframe = createIframe({
        el: document.getElementById('output-iframe'),
        sandboxAttributes
      })

      window.addEventListener('message', this.listenIframe)
      Event.$on('run', () => this.run())
      Event.$on('refresh-editor', ({
        run = true
      } = {}) => {
        run && this.run()
      })
      Event.$on(`set-output-pan-style`, style => {
        this.style = {
          ...this.style,
          ...style
        }
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
          this.iframeStatus = 'error'
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
        } else if (data.type === 'iframe-success') {
          this.iframeStatus = 'success'
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
            window.parent.postMessage({ type: 'iframe-success' }, '*');
            ${this.transformJS(this.js)}
          };`
          html = this.transformHTML(this.html)
          css = this.css.code // eslint-disable-line prefer-const
        } catch (err) {
          return this.addLog({ type: 'error', message: err.message })
        }

        const head = createElement('style')(css)
        const body = createElement('script')(proxyConsole) + html + createElement('script')(js)

        this.iframe.setHTML({
          head,
          body
        })
        this.iframeStatus = 'loading'
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
    },
    components: {
      SvgIcon,
      Spinner
    }
  }
</script>

<style lang="stylus" scoped>
$statusSize = 12px

.output-pan
  overflow: hidden

.output-iframe
  width: 100%
  height: calc(100% - 40px)
  &.disable-mouse-events
    pointer-events: none

.output-success, .output-error
  margin-right: -100px
  animation: 4s ease-out slide-out
  >>> svg
    width: $statusSize
    height: @width
    color: #11bf11
    stroke-width: 3

.output-error
  >>> svg
    color: red

@keyframes slide-out
  0%, 60%
    margin-right: 0

  100%
    margin-right: -100px
</style>
