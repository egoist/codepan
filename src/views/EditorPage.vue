<template>
  <div class="page" :class="{ readonly: isReadOnly, headless: urlParams.headless === 'true' }">
    <home-header v-if="urlParams.headless !== 'true'"/>

    <section class="dialogs">
      <compiled-code-dialog
        v-if="js.code"
        :code="js"
        :show.sync="showCompiledCode.js"
        highlight="javascript"
        type="js"
      ></compiled-code-dialog>

      <compiled-code-dialog
        v-if="html.code"
        :code="html"
        :show.sync="showCompiledCode.html"
        highlight="htmlmixed"
        type="html"
      ></compiled-code-dialog>

      <compiled-code-dialog
        v-if="css.code"
        :code="css"
        :show.sync="showCompiledCode.css"
        highlight="css"
        type="css"
      ></compiled-code-dialog>
    </section>

    <div :class="{ pans: true, [urlParams.layout]: true, headless: urlParams.headless === 'true' }" :style="{ flexDirection: urlParams.layout }">
      <dynamic-pan v-for="pan in visiblePans" :key="pan" :pan="pan"/>

      <dynamic-pan
        :key="'output'"
        :pan="'output'"
        v-if="visiblePans.indexOf('output') === -1"
        style="display: none;"
      />

      <codefund />
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
import Codefund from '@/components/Codefund.vue'
import HomeHeader from '@/components/HomeHeader.vue'
import DynamicPan from '@/components/DynamicPan.vue'
import CompiledCodeDialog from '@/components/CompiledCodeDialog.vue'

async function handleRouteChange(to, from, vm) {

  if (from !== to) {
    switch (to.name) {
    case 'home':
      await vm.setBoilerplate(to.query.boilerplate)
      await vm.setGist(to.query.gist)
      break
    case 'boilerplate': 
      await vm.setBoilerplate(to.params.boilerplate)
      break
    case 'gist': 
      await vm.setGist(to.params.gist)
      break
    }
  }

  Event.$emit('refresh-editor')
  Event.$emit('run')

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
    ...mapState([
      'visiblePans',
      'editorStatus',
      'js',
      'css',
      'html',
      'urlParams'
    ])
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      await handleRouteChange(to, from, vm)
    })
  },
  async beforeRouteUpdate(to, from, next) {
    await handleRouteChange(to, from, this)
    next()
  },
  watch: {
    '$route.query.show': {
      handler(next, prev) {
        if (!next && prev) {
          this.showPans(['js', 'output'])
        } else if (next !== prev) {
          this.showPans(next.split(','))
        }
      },
      immediate: true
    }
  },
  mounted() {
    window.addEventListener('storage', this.handleStorageChanged)

    window.addEventListener('beforeunload', e => {
      if (!inIframe && !isElectron() && this.editorStatus !== 'saved') {
        e.returnValue = false
        return false
      }
    })

    // Since in prevous versions we didn't fetch userMeta after login
    // We need to force user to re-login in order to get that data
    if (
      this.$store.state.githubToken &&
      Object.keys(this.$store.state.userMeta).length === 0
    ) {
      this.$store.dispatch('setGitHubToken', null).then(() => {
        notie.alert({
          type: 'warning',
          text: `You need to login again to use the new version!`
        })
      })
    }
  },
  created() {
    Event.$on('refresh-editor', () => this.refreshFromUrl())

    Event.$on('show-compiled-code', type => {
      this.showCompiledCode[type] = true
    })
  },
  methods: {
    ...mapActions(['setBoilerplate', 'setGist', 'showPans', 'setAutoRun', 'refreshFromUrl']),
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
    },
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.handleStorageChanged)
  },
  components: {
    HomeHeader,
    DynamicPan,
    Codefund,
    CompiledCodeDialog
  }
}
</script>

<style src="codemirror/lib/codemirror.css">
</style>
<style src="codemirror/addon/fold/foldgutter.css">
</style>

<style lang="stylus" scoped>
.pans {
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>
