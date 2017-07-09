import { mapActions, mapState } from 'vuex'
import createEditor from '@/utils/create-editor'
import Event from '@/utils/event'
import panPosition from '@/utils/pan-position'
import { hasNextPan } from '@/utils'

const getEditorModeByTransfomer = transformer => {
  const modes = {
    html: 'htmlmixed',
    pug: 'pug',
    markdown: 'markdown',
    js: 'jsx',
    'vue-jsx': 'jsx',
    babel: 'jsx',
    jsx: 'jsx',
    css: 'css'
  }
  return modes[transformer]
}

const getHumanlizedTransformerName = transformer => {
  const names = {
    html: 'HTML',
    pug: 'Pug',
    markdown: 'Markdown',
    js: 'JavaScript',
    'vue-jsx': 'Vue JSX',
    babel: 'Babel',
    jsx: 'JSX',
    css: 'CSS'
  }

  return names[transformer] || transformer
}

export default ({ name, editor, components } = {}) => {
  return {
    name: `${name}-pan`,
    data() {
      return {
        style: {}
      }
    },
    computed: {
      ...mapState([name, 'visiblePans', 'activePan']),
      ...mapState({
        isVisible: state => state.visiblePans.indexOf(name) !== -1
      }),
      enableResizer() {
        return hasNextPan(this.visiblePans, name)
      },
      isActivePan() {
        return this.activePan === name
      },
      humanlizedTransformerName() {
        return getHumanlizedTransformerName(this[name].transformer)
      }
    },
    watch: {
      isVisible() {
        this.editor.refresh()
      },
      visiblePans: {
        immediate: true,
        handler(val) {
          this.style = panPosition(val, name)
        }
      }
    },
    mounted() {
      this.editor = createEditor(this.$refs.editor, editor)
      this.editor.on('change', e => {
        this.updateCode({ code: e.getValue(), type: name })
      })
      this.editor.on('focus', () => {
        if (this.activePan !== name) {
          this.setActivePan(name)
        }
      })
      Event.$on('refresh-editor', () => {
        this.editor.setValue(this[name].code)
        this.editor.refresh()
      })
      Event.$on(`set-${name}-pan-style`, style => {
        this.style = {
          ...this.style,
          ...style
        }
      })
    },
    methods: {
      ...mapActions(['updateCode', 'updateTransformer', 'setActivePan']),
      async setTransformer(transformer) {
        await this.updateTransformer({ type: name, transformer })
        this.editor.setOption('mode', getEditorModeByTransfomer(transformer))
      }
    },
    components
  }
}
