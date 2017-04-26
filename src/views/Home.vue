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
  import Event from '@/utils/event'
  import HomeHeader from '@/components/HomeHeader.vue'
  import HTMLPan from '@/components/HTMLPan.vue'
  import JSPan from '@/components/JSPan.vue'
  import OutputPan from '@/components/OutputPan.vue'
  import ConsolePan from '@/components/ConsolePan.vue'
  import CSSPan from '@/components/CSSPan.vue'

  export default {
    name: 'home',
    computed: {
      ...mapState(['visiblePans'])
    },
    beforeRouteUpdate(to, from, next) {
      progress.done()
      next()
    },
    async mounted() {
      const { boilerplate } = this.$route.query
      if (boilerplate) {
        await this.setBoilerplate(boilerplate)
        Event.$emit('refresh-editor')
      }
      progress.done()

      // Tell the parent window we're ready!
      if (window.self !== window.top) {
        window.parent.postMessage({ type: 'codepan-ready' }, '*')
      }
    },
    methods: {
      ...mapActions(['setBoilerplate']),
      isVisible(pan) {
        return this.visiblePans.indexOf(pan) !== -1
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

<style scoped>
  .pans {
    height: calc(100% - 40px);
    display: flex;
    position: relative;
  }

  .pan {
    background-color: #f9f9f9;
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: auto;
    &.highlight-pan {
      background-color: white;
    }
  }
</style>

<style>
  .CodeMirror {
    height: calc(100% - 40px);
    background-color: transparent;
  }

  .CodeMirror-gutters {
    background-color: transparent;
    border-right: none;
  }

  .pan-head {
    height: 40px;
    padding: 0 10px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pans.resizing {
    cursor: ew-resize;
    .pan-resizer {
      cursor: ew-resize;
    }
  }
</style>
