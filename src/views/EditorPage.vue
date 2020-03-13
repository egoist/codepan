<template>
  <div class="page" :class="{readonly: isReadOnly}">
    <home-header />

    <compiled-code-dialog
      v-if="js.code"
      :code="js"
      :show.sync="showCompiledCode.js"
      highlight="javascript"
      type="js">
    </compiled-code-dialog>

    <compiled-code-dialog
      v-if="html.code"
      :code="html"
      :show.sync="showCompiledCode.html"
      highlight="htmlmixed"
      type="html">
    </compiled-code-dialog>

    <compiled-code-dialog
      v-if="css.code"
      :code="css"
      :show.sync="showCompiledCode.css"
      highlight="css"
      type="css">
    </compiled-code-dialog>

    <div class="pans">
      <html-pan class="pan" v-show="isVisible('html')" />
      <css-pan class="pan" v-show="isVisible('css')" />
      <js-pan class="pan" v-show="isVisible('js')" />
      <console-pan class="pan" v-show="isVisible('console')" />
      <output-pan class="pan" v-show="isVisible('output')" />
    </div>

    <div ref="sponsor" class="sponsor">
      <a href="https://github.com/sponsors/egoist" target="_blank" rel="noopener nofollow">❤️ Sponsor me on GitHub to support the rewrite of CodePan!</a>
    </div>
  </div>
</template>

<script>
import progress from 'nprogress'
import { mapState, mapActions } from 'vuex'
import notie from 'notie'
import isElectron from 'is-electron'
import { inIframe } from '@/utils'
import Event from '@/utils/event'
import HomeHeader from '@/components/HomeHeader.vue'
import HTMLPan from '@/components/HTMLPan.vue'
import JSPan from '@/components/JSPan.vue'
import OutputPan from '@/components/OutputPan.vue'
import ConsolePan from '@/components/ConsolePan.vue'
import CSSPan from '@/components/CSSPan.vue'
import CompiledCodeDialog from '@/components/CompiledCodeDialog.vue'

async function handleRouteChange(to, vm) {
  let boilerplate
  let gist

  const { name } = to

  if (name === 'home') {
    boilerplate = to.query.boilerplate
    gist = to.query.gist
  } else if (name === 'boilerplate') {
    boilerplate = to.params.boilerplate
  } else if (name === 'gist') {
    gist = to.params.gist
  }

  if (boilerplate) {
    await vm.setBoilerplate(boilerplate)
    Event.$emit('refresh-editor')
    Event.$emit('run')
  } else if (gist) {
    await vm.setGist(gist)
    Event.$emit('refresh-editor')
    Event.$emit('run')
  }

  await vm.setAutoRun(true)

  progress.done()
}

export default {
  name: 'editor-page',
  data() {
    return {
      showCompiledCode: {
        js: false,
        css: false,
        html: false
      },
      isReadOnly: 'readonly' in this.$route.query
    }
  },
  computed: {
    ...mapState(['visiblePans', 'editorStatus', 'js', 'css', 'html'])
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      await handleRouteChange(to, vm)
    })
  },
  async beforeRouteUpdate(to, from, next) {
    console.log('route updated to', to)
    await handleRouteChange(to, this)
    next()
  },
  watch: {
    '$route.query.show': {
      handler(next, prev) {
        if (!next && prev) {
          this.showPans(['js', 'html', 'output'])
        } else if (next !== prev) {
          this.showPans(next.split(','))
        }
      },
      immediate: true
    }
  },
  mounted() {
    // Tell the parent window we're ready!
    if (inIframe) {
      window.parent.postMessage({ type: 'codepan-ready' }, '*')
    }

    window.addEventListener('storage', this.handleStorageChanged)

    window.addEventListener('beforeunload', e => {
      if (!inIframe && !isElectron() && this.editorStatus !== 'saved') {
        e.returnValue = false
        return false
      }
    })

    // Since in prevous versions we didn't fetch userMeta after login
    // We need to force user to re-login in order to get that data
    if (this.$store.state.githubToken && Object.keys(this.$store.state.userMeta).length === 0) {
      this.$store.dispatch('setGitHubToken', null)
        .then(() => {
          notie.alert({
            type: 'warning',
            text: `You need to login again to use the new version!`
          })
        })
    }

    Event.$on('show-compiled-code', type => {
      this.showCompiledCode[type] = true
    })
  },
  methods: {
    ...mapActions(['setBoilerplate', 'setGist', 'showPans', 'setAutoRun']),
    isVisible(pan) {
      return this.visiblePans.indexOf(pan) !== -1
    },
    handleStorageChanged(e) {
      if (e.key === 'codepan:gh-token' && e.newValue) {
        this.$store.dispatch('setGitHubToken', e.newValue)
        if (inIframe) {
          notie.confirm({
            text: 'Success, reload this iframe?',
            submitCallback() {
              window.location.reload()
            }
          })
        } else {
          notie.alert({
            type: 'success',
            text: 'Successfully logged in with GitHub!'
          })
        }
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.handleStorageChanged)
  },
  components: {
    'html-pan': HTMLPan,
    'js-pan': JSPan,
    'output-pan': OutputPan,
    'console-pan': ConsolePan,
    'css-pan': CSSPan,
    'home-header': HomeHeader,
    CompiledCodeDialog
  }
}
</script>

<style src="codemirror/lib/codemirror.css">

</style>
<style src="codemirror/addon/fold/foldgutter.css">

</style>

<style lang="stylus" scoped>
.pans
  height: calc(100% - 40px - 40px)
  display: flex
  position: relative

.pan
  background-color: #f9f9f9
  position: absolute
  top: 0
  bottom: 0
  overflow: auto
  &.active-pan
    background-color: white
</style>

<style lang="stylus">
.CodeMirror
  height: calc(100% - 40px)
  background-color: transparent

.CodeMirror-gutters
  background-color: transparent
  border-right: none

.pan-head
  height: 40px
  padding: 0 10px
  font-size: 14px
  display: flex
  justify-content: space-between
  align-items: center
  svg.svg-icon
    margin-left: 5px
    cursor: pointer
    width: 14px
    height: @width
    color: #666
    outline: none
    &:hover
      color: #000

.pans.resizing
  cursor: ew-resize
  .pan-resizer
    cursor: ew-resize

.page.readonly
  .CodeMirror-cursor
    display: none !important

.cf-wrapper
  height: 40px
  line-height: 40px !important
  z-index: 9999 !important
  padding: 0 10px !important

.sponsor
  height: 40px
  line-height 40px
  border-top: 1px solid #ccc
  text-align: center
  padding: 0 10px
  a
    text-decoration: none
    &:hover
      text-decoration: underline
</style>
