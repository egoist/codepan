<template>
  <modal
    class="compiled-code-dialog"
    :is-open="show"
    :click-outside="() => $emit('update:show', false)">
    <h2 class="modal-title">
      <repeat-icon class="svg-icon"></repeat-icon>
      Compiled with {{ transformerName }}</h2>
    <highlight :mode="highlight">{{ transformedCode }}</highlight>
  </modal>
</template>

<script>
import Modal from 'vue-slim-modal'
import { mapActions } from 'vuex'
import { getHumanlizedTransformerName } from '@/utils'
import * as transform from '@/utils/transform'
import Highlight from './Highlight'
import { RepeatIcon } from 'vue-feather-icons'

export default {
  name: 'compiled-code-dialog',
  props: ['show', 'type', 'code', 'highlight'],
  data() {
    return {
      transformedCode: ''
    }
  },
  watch: {
    show(show) {
      if (!show) return

      try {
        this.transformedCode = transform[this.type](this.code)
      } catch (err) {
        const message = `compiler error: ${err.message}`
        this.addLog({ type: 'error', message })
        this.transformedCode = message
      }
    }
  },
  computed: {
    source() {
      return this.$store.state[this.type]
    },
    transformerName() {
      return getHumanlizedTransformerName(this.source.transformer)
    }
  },
  methods: {
    ...mapActions(['addLog'])
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
