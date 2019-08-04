<template>
  <div class="output-pan" :class="{ 'active-pan': isActivePan }" @click="setActivePan('output')">
    <div class="pan-head">Output</div>
    <div class="output-iframe" id="output-iframe">
      <div id="output-iframe-holder">
        <iframe/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getHumanlizedTransformerName } from '@/utils'
import axios from 'axios'
import notie from 'notie'
import * as transform from '@/utils/transform'
import Event from '@/utils/event'
import getScripts from '@/utils/get-scripts'
import proxyConsole from '!babel-loader?presets[]=@babel/env!raw-loader!buble-loader!@/utils/proxy-console'

const sandboxAttributes = [
  'allow-modals',
  'allow-forms',
  'allow-pointer-lock',
  'allow-popups',
  'allow-same-origin',
  'allow-scripts'
]

const replaceQuote = str => str.replace(/__QUOTE_LEFT__/g, '<')

const createElement = tag => (content = '', attrs = {}) => {
  const attributeString = Object.keys(attrs)
    .map(key => `${key}="${attrs[key]}"`)
    .join(' ')

  return `<${tag} ${attributeString}>${content}<${tag}/>`
}

const makeGist = (data, { showPans, activePan }) => {
  const files = {}

  const manifest = {
    ...data,
    showPans,
    activePan
  }

  files['codepan.json'] = {
    content: JSON.stringify(manifest, null, 2)
  }

  return files
}

export default {
  name: 'output-pan',
  computed: {
    ...mapState([
      'js',
      'css',
      'html',
      'visiblePans',
      'activePan',
      'githubToken',
      'iframeStatus'
    ]),
    ...mapGetters(['isLoggedIn', 'canUpdateGist']),
    isActivePan() {
      return this.activePan === 'output'
    }
  },
  mounted() {
    this.iframe = this.getIframe()
  },
  created() {
    window.addEventListener('message', this.listenIframe)

    Event.$on('run', () => this.run())
    Event.$on('save-gist', saveNew => {
      this.saveGist({ token: this.githubToken, saveNew })
    })
  },
  methods: {
    ...mapActions([
      'addLog',
      'clearLogs',
      'setActivePan',
      'setBoilerplate',
      'editorSaved',
      'editorSaving',
      'editorSavingError',
      'setIframeStatus',
      'transform'
    ]),
    getHumanlizedTransformerName,

    getIframe() {
      const iframe = this.$el.getElementsByTagName('iframe')[0]
      iframe.setAttribute('sandbox', sandboxAttributes.join(' '))
      iframe.setAttribute('scrolling', 'yes')
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.style.border = '0'
      return iframe
    },

    async listenIframe({ data = {} }) {
      if (data.type === 'iframe-error') {
        this.addLog({ type: 'error', message: data.message.trim() })
        this.setIframeStatus('error')
      } else if (data.type === 'codepan-console') {
        if (data.method === 'clear') {
          this.clearLogs()
        } else {
          this.addLog({ type: data.method, message: data.args.join('') })
        }
      } else if (data.type === 'codepan-make-output-active') {
        this.setActivePan('output')
      } else if (data.type === 'codepan-set-boilerplate' && data.boilerplate) {
        await this.setBoilerplate(JSON.parse(data.boilerplate))
        Event.$emit('refresh-editor')
      } else if (data.type === 'iframe-success') {
        this.setIframeStatus('success')
      }
    },

    async run() {
      this.setIframeStatus('loading')
      const transformed = {
        html: '',
        js: '',
        css: ''
      }
      const scripts = []

      await this.transform(true)

      try {
        await Promise.all([
          transform.html(this.html).then(code => {
            transformed.html = code
          }),
          transform
            .js(this.js)
            .then(code => getScripts(code, scripts))
            .then(code => {
              transformed.js = code
            }),
          transform.css(this.css).then(code => {
            transformed.css = code
          })
        ]).catch(err => {
          throw err
        })

        localStorage.setItem('codepan.css', this.css.code)
        localStorage.setItem('codepan.html', this.html.code)
        localStorage.setItem('codepan.js', this.js.code)

        transformed.js = `
            try {
              if (window.Vue) {
                window.Vue.config.productionTip = false;
              }
              window.addEventListener('DOMContentLoaded', function() {
                ${transformed.js}
                window.parent.postMessage({ type: 'iframe-success' }, '*');
              })
            } catch (err) {
              window.parent.postMessage({
                type: 'iframe-error',
                message: err instanceof Error ? (err.frame ? err.message + '\\n' + err.frame : err.stack) : err
              }, '*')
            }
        `
      } catch (err) {
        this.setIframeStatus('error')
        return this.addLog({
          type: 'error',
          message: err.frame ? `${err.message}\n${err.frame}` : err.stack
        })
      }

      await this.transform(false)

      const headStyle = createElement('style')(transformed.css)
      const codePanRuntime = [
        createElement('script')(`window.process = window.process || { env: { NODE_ENV: 'development' } }`),
        createElement('script')(proxyConsole),
        ...scripts.map(script =>
          createElement('script')('', { src: `https://bundle.run/${script.module}${script.path}?name=${script.name}` })
        )
      ].join('\n')

      const head = `${headStyle}\n${codePanRuntime}`

      const body = [
        createElement('script')('console.clear();'),
        transformed.html,
        createElement('script')(transformed.js)
      ].join('\n')

      const iframeContent = `<!DOCTYPE html>
      <html>
        <head>${head}</head>
        <body>${body}</body>
      </html>`

      this.iframe.src = `data:text/html;charset=utf-8,${iframeContent}`
    },

    /**
     * Save gist
     * When you are not logged in (no github token) it saves as guest gist
     * Otherwise it creates or updates gist
     */
    async saveGist({ token, saveNew } = {}) {
      this.editorSaving()
      try {
        const files = makeGist(
          {
            js: this.js,
            css: this.css,
            html: this.html
          },
          {
            showPans: this.visiblePans,
            activePan: this.activePan
          }
        )
        const params = {}
        if (token) {
          // eslint-disable-next-line camelcase
          params.access_token = token
        }
        const shouldUpdateGist = this.canUpdateGist && !saveNew
        const url = `https://api.github.com/gists${
          shouldUpdateGist ? `/${this.$route.params.gist}` : ''
        }`
        const method = shouldUpdateGist ? 'PATCH' : 'POST'
        const { data } = await axios(url, {
          params,
          method,
          data: {
            public: false,
            files
          }
        })

        if (shouldUpdateGist) {
          this.editorSaved()
        } else {
          this.$router.push(`/gist/${data.id}`)
          if (token) {
            // Update gist id in the description of newly created gist
            axios(`https://api.github.com/gists/${data.id}`, {
              method: 'PATCH',
              params,
              data: {
                description: `Try it online! https://codepan.net/gist/${
                  data.id
                }`
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
  }
}
</script>

<style lang="stylus" scoped>
$statusSize = 12px;

.output-pan {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.output-iframe {
  position: relative;
  flex: 1;

  &.disable-mouse-events {
    pointer-events: none;
  }
}
</style>
