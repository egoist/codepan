import debounce from 'debounce'
import { mapActions, mapState } from 'vuex'
import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
import CompiledCodeSwitcher from '@/components/CompiledCodeSwitcher.vue'
import createEditor from '@/utils/create-editor'
import Event from '@/utils/event'
import {
  hasNextPan,
  getHumanlizedTransformerName,
  getEditorModeByTransfomer
} from '@/utils'

export default ({ name, editor, components } = {}) => {
  return {
    name: `${name}-pan`,
    data() {
      return {
        style: {}
      }
    },
    computed: {
      ...mapState([name, 'visiblePans', 'activePan', 'autoRun']),
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
        handler() {
          this.style.height = `${100 / this.visiblePans.length}%`
        }
      },
      [`${name}.code`]() {
        if (this.autoRun) {
          this.debounceRunCode()
        }
      },
      [`${name}.transformer`](val) {
        const mode = getEditorModeByTransfomer(val)
        this.editor.setOption('mode', mode)
      }
    },
    async mounted() {
      this.editor = await createEditor(this.$refs.editor, {
        ...editor,
        readOnly: 'readonly' in this.$route.query
      })
      this.editor.on('change', e => {
        this.updateCode({ code: e.getValue(), type: name })
        this.editorChanged()
      })
      this.editor.on('focus', () => {
        if (this.activePan !== name && this.visiblePans.indexOf(name) > -1) {
          this.setActivePan(name)
        }
      })
    },
    created() {
      Event.$on('refresh-editor', () => {
        if (!this[name].code) return
        this.editor.setValue(this[name].code)
        this.editor.refresh()
      })
      // Focus the editor
      // This is usually emitted after setting boilerplate or gist
      Event.$on('focus-editor', active => {
        if (active === name) {
          this.editor.focus()
        }
      })
      Event.$on(`set-${name}-pan-style`, style => {
        this.style = {
          ...this.style,
          ...style
        }
      })
    },
    methods: {
      ...mapActions([
        'updateCode',
        'updateTransformer',
        'setActivePan',
        'editorChanged'
      ]),
      debounceRunCode: debounce(() => {
        Event.$emit('run')
      }, 500),
      async setTransformer(transformer) {
        await this.updateTransformer({ type: name, transformer })
      }
    },
    components: {
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      CompiledCodeSwitcher,
      ...components
    }
  }
}
