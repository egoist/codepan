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
      ...mapState([name, 'activePans']),
      ...mapState({
        isActive: state => state.activePans.indexOf(name) !== -1
      }),
      style() {
        return panPosition(this.activePans, name)
      },
      enableResizer() {
        return hasNextPan(this.activePans, name)
      }
    },
    watch: {
      isActive() {
        this.editor.refresh()
      }
    },
    mounted() {
      this.editor = createEditor(this.$refs.editor, editor)
      this.editor.on('change', e => {
        this.updateCode({ code: e.getValue(), type: name })
      })
      Event.$on('refresh-editor', () => {
        this.editor.setValue(this[name].code)
        this.editor.refresh()
      })
    },
    methods: {
      ...mapActions(['updateCode', 'updateTransformer']),
      setTransformer(transformer) {
        this.updateTransformer({ type: name, transformer })
      }
    },
    components
  }
}
