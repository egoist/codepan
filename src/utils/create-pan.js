import { mapActions, mapState } from 'vuex'
import createEditor from '@/utils/create-editor'
import Event from '@/utils/event'
import panPosition from '@/utils/pan-position'
import { hasNextPan } from '@/utils'

export default ({
  name,
  editor,
  components
} = {}) => {
  return {
    name: `${name}-pan`,
    computed: {
      ...mapState([name, 'visiblePans', 'highlightPan']),
      ...mapState({
        isVisible: state => state.visiblePans.indexOf(name) !== -1
      }),
      style() {
        return panPosition(this.visiblePans, name)
      },
      enableResizer() {
        return hasNextPan(this.visiblePans, name)
      },
      isHighlightPan() {
        return this.highlightPan === name
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
        if (this.highlightPan !== name) {
          this.setHighlightPan(name)
        }
      })
      Event.$on('refresh-editor', () => {
        this.editor.setValue(this[name].code)
        this.editor.refresh()
      })
    },
    methods: {
      ...mapActions(['updateCode', 'updateTransformer', 'setHighlightPan']),
      setTransformer(transformer) {
        this.updateTransformer({ type: name, transformer })
      }
    },
    components
  }
}
