<template>
  <div class="page" >
    <home-header />
    <div class="pans">
      <html-pan class="pan" v-show="isVisible('html')" />
      <css-pan class="pan" v-show="isVisible('css')" />
      <js-pan class="pan" v-show="isVisible('js')" />
      <console-pan class="pan" v-show="isVisible('console')" />
      <output-pan class="pan" v-show="isVisible('output')" />
    </div>
  </div>
</template>

<script>
  import progress from 'nprogress'
  import { mapState, mapActions } from 'vuex'
  import notie from 'notie'
  import Event from '@/utils/event'
  import HomeHeader from '@/components/HomeHeader.vue'
  import HTMLPan from '@/components/HTMLPan.vue'
  import JSPan from '@/components/JSPan.vue'
  import OutputPan from '@/components/OutputPan.vue'
  import ConsolePan from '@/components/ConsolePan.vue'
  import CSSPan from '@/components/CSSPan.vue'

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
    } else if (gist) {
      await vm.setGist(gist)
      Event.$emit('refresh-editor')
    }

    progress.done()
  }

  export default {
    name: 'editor-page',
    computed: {
      ...mapState(['visiblePans'])
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
      if (window.self !== window.top) {
        window.parent.postMessage({ type: 'codepan-ready' }, '*')
      }

      window.addEventListener('storage', this.handleStorageChanged)
    },
    methods: {
      ...mapActions(['setBoilerplate', 'setGist', 'showPans']),
      isVisible(pan) {
        return this.visiblePans.indexOf(pan) !== -1
      },
      handleStorageChanged(e) {
        if (e.key === 'codepan:gh-token') {
          this.$store.dispatch('setGitHubToken', e.newValue)
          notie.alert({
            type: 'success',
            text: 'Successfully logged in with GitHub!'
          })
        }
      }
    },
    components: {
      'html-pan': HTMLPan,
      'js-pan': JSPan,
      'output-pan': OutputPan,
      'console-pan': ConsolePan,
      'css-pan': CSSPan,
      'home-header': HomeHeader
    }
  }
</script>

<style src="codemirror/lib/codemirror.css"></style>

<style lang="stylus" scoped>
.pans
  height: calc(100% - 40px)
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
  .svg-icon
    cursor: pointer
    svg
      width: 16px
      height: @width
      color: #666
    &:hover
      svg
        color: #333

.pans.resizing
  cursor: ew-resize
  .pan-resizer
    cursor: ew-resize
</style>
