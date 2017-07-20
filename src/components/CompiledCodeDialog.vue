<template>
  <modal
    class="compiled-code-dialog"
    :is-open="show"
    :click-outside="() => $emit('update:show', false)">
    <h2 class="modal-title">
      <svg-icon name="code" class="svg-icon"></svg-icon>
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
import SvgIcon from './SvgIcon.vue'

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
    SvgIcon
  }
}
</script>

<style lang="stylus" scoped>
.compiled-code-dialog
  padding: 0
  width: 50%
  background: white
  top: 41px

.modal-title
  margin: 0
  padding: 15px 0
  font-weight: 500
  font-size: 1rem
  display: flex
  align-items: center
  justify-content: center

.svg-icon
  margin-right: 8px
  >>> svg
    margin-top: 2px
    width: 20px
    height: @width
</style>
