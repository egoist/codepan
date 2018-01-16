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
    <div class="output-iframe" id="output-iframe">
      <div id="output-iframe-holder"></div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { getHumanlizedTransformerName } from '@/utils'
  import axios from 'axios'
  import notie from 'notie'
  import * as transform from '@/utils/transform'
  import createIframe from '@/utils/iframe'
  import Event from '@/utils/event'
  import panPosition from '@/utils/pan-position'
  import getScripts from '@/utils/get-scripts'
  import proxyConsole from '!raw-loader!babel-loader?presets[]=babili&-babelrc!buble-loader!@/utils/proxy-console'
  import SvgIcon from './SvgIcon.vue'
  import Spinner from './Spinner.vue'

  const sandboxAttributes = ['allow-modals', 'allow-forms', 'allow-pointer-lock', 'allow-popups', 'allow-same-origin', 'allow-scripts']

  const replaceQuote = str => str.replace(/__QUOTE_LEFT__/g, '<')

  const createElement = tag => (content = '', attrs = {}) => {
    attrs = Object.keys(attrs).map(key => {
      return `${key}="${attrs[key]}"`
    }).join(' ')
    return replaceQuote(`__QUOTE_LEFT__${tag} ${attrs}>${content}__QUOTE_LEFT__/${tag}>`)
  }

  const makeGist = (data, { showPans, activePan }) => {
    const files = {}

    const manifest = {
      ...data,
      showPans,
      activePan
    }

    files['codepan.json'] = {
      content: JSON.stringify(manifest)
    }

    return files
  }

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
      ...mapState(['js', 'css', 'html', 'visiblePans', 'activePan', 'githubToken']),
      isActivePan() {
        return this.activePan === 'output'
      }
    },
    mounted() {
      this.iframe = createIframe({
        el: document.getElementById('output-iframe-holder'),
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
      Event.$on('save-gist', update => {
        this.saveGist({ token: this.githubToken, update })
      })
      Event.$on('save-anonymous-gist', () => {
        this.saveGist()
      })
    },
    beforeDestroy() {
      window.removeEventListener('message', this.listenIframe)
    },
    methods: {
      ...mapActions(['addLog', 'clearLogs', 'setActivePan', 'setBoilerplate', 'editorSaved', 'editorSaving', 'editorSavingError']),
      getHumanlizedTransformerName,

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

      async run() {
        let js
        // We may add preprocessors supports for html/css in the future
        let html
        let css
        let scripts = []
        js = getScripts(await transform.js(this.js), scripts)
        try {
          js = `
          if (window.Vue) {
            window.Vue.config.productionTip = false
          }
          document.addEventListener('DOMContentLoaded', __executeCodePan)
          function __executeCodePan(){
            window.parent.postMessage({ type: 'iframe-success' }, '*');
            ${js}
          };`
          html = await transform.html(this.html,)
          css = await transform.css(this.css) // eslint-disable-line prefer-const
        } catch (err) {
          return this.addLog({ type: 'error', message: err.stack })
        }

        const head = createElement('style')(css)
        const shims = createElement('script')(`
        window.process = window.process || { env: { NODE_ENV: 'development' } }
        `)
        const body = shims + scripts.map(script =>
          createElement('script')('', { src: `https://packd.now.sh/${script.package}@latest?name=${script.variable}` })
        ).join('\n') + createElement('script')(proxyConsole) + html + createElement('script')(js)

        this.iframe.setHTML({
          head,
          body
        })
        this.iframeStatus = 'loading'
      },

      async saveGist({ token, update } = {}) {
        this.editorSaving()
        try {
          const files = makeGist({
            js: this.js,
            css: this.css,
            html: this.html
          }, {
            showPans: this.visiblePans,
            activePan: this.activePan
          })
          const params = {}
          if (token) {
            // eslint-disable-next-line camelcase
            params.access_token = token
          }
          const gistId = this.$route.params.gist
          const url = `https://api.github.com/gists${update ? `/${gistId}` : ''}`
          const method = update ? 'PATCH' : 'POST'
          const { data } = await axios(url, {
            params,
            method,
            data: {
              public: false,
              files
            }
          })

          if (update) {
            this.editorSaved()
          } else {
            this.$router.push(`/gist/${data.id}`)
            if (token) {
              // Update gist id in the description of newly created gist
              axios(`https://api.github.com/gists/${data.id}`, {
                method: 'PATCH',
                params,
                data: {
                  description: `Try it online! https://codepan.net/gist/${data.id}`
                }
              }).catch(err => console.log(err))
            }
          }
        } catch (err) {
          this.editorSavingError()
          if (err.response) {
            notie.alert({
              type: 'error',
              text: err.response.data.message
            })
          }
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
