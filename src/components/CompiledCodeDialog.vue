<template>
  <modal
    class="compiled-code-dialog"
    :is-open="show"
    :click-outside="() => $emit('update:show', false)">
    <h2 class="modal-title">
      <repeat-icon class="svg-icon"></repeat-icon>
      Compiled with {{ transformerName }}</h2>
    <highlight :mode="highlight">{{ transforming ? 'Compiling..' : transformedCode }}</highlight>
  </modal>
</template>

<script>
import Modal from 'vue-slim-modal'
import { mapActions, mapState } from 'vuex'
import { RepeatIcon } from 'vue-feather-icons'
import { getHumanlizedTransformerName } from '@/utils'
import * as transform from '@/utils/transform'
import Highlight from './Highlight'

export default {
  name: 'compiled-code-dialog',
  props: ['show', 'type', 'code', 'highlight'],
  data() {
    return {
      transformedCode: ''
    }
  },
  watch: {
    async show(show) {
      if (!show) return
      await this.transform(true)
      try {
        this.transformedCode = await transform[this.type](this.code)
      } catch (err) {
        const message = `compiler error: ${err.message}`
        this.addLog({ type: 'error', message })
        this.transformedCode = message
      }
      await this.$nextTick()
      await this.transform(false)
    }
  },
  computed: {
    ...mapState(['transforming']),
    source() {
      return this.$store.state[this.type]
    },
    transformerName() {
      return getHumanlizedTransformerName(this.source.transformer)
    }
  },
  methods: {
    ...mapActions(['addLog', 'transform'])
  },
  components: {
    Modal,
    Highlight,
    RepeatIcon
  }
}
</script>

<style lang="stylus" scoped>
.compiled-code-dialog
  padding: 0
  width: 50%
  background: white
  top: 41px
  border-radius: 3px

.modal-title
  margin: 0
  padding: 15px 0
  font-weight: 500
  font-size: 1rem
  display: flex
  align-items: center
  justify-content: center
  border-bottom: 1px solid #e2e2e2

.svg-icon
  margin-right: 8px
  width: 16px
  height: @width
</style>
