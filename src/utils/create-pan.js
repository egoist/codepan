import { mapActions, mapState } from 'vuex'
import createEditor from '@/utils/create-editor'
import Event from '@/utils/event'
import panPosition from '@/utils/pan-position'
import { hasNextPan } from '@/utils'

const getEditorModeByTransfomer = transformer => {
  const modes = {
    HTML: 'htmlmixed',
    Pug: 'pug',
    Markdown: 'markdown',
    JavaScript: 'jsx',
    'Vue JSX': 'jsx',
    Babel: 'jsx',
    JSX: 'jsx',
    CSS: 'css'
  }
  return modes[transformer]
}

export default ({ name, editor, components } = {}) => {
  return {
    name: `${name}-pan`,
    computed: {
      ...mapState([name, 'visiblePans', 'activePan']),
      ...mapState({
        isVisible: state => state.visiblePans.indexOf(name) !== -1
      }),
      style() {
        return panPosition(this.visiblePans, name)
      },
      enableResizer() {
        return hasNextPan(this.visiblePans, name)
      },
      isActivePan() {
        return this.activePan === name
      }
    },
    watch: {
      isVisible() {
        this.editor.refresh()
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
