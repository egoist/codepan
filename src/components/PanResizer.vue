<template>
  <div class="pan-resizer" :class="{ enable }" ref="resizer" @mousedown="handleMouseDown"></div>
</template>

<script>
import Event from '@/utils/event'
import { mapState } from 'vuex'

export default {
  props: ['enable', 'pan'],
  data() {
    return {
      resizing: false,
      originalNextPanTop: null,
      originalNextPanBottom: null,
      originalCurrentPanBottom: null,
      originalCurrentPanTop: null,
      currentPan: null,
      nextPan: null
    }
  },
  computed: {
    ...mapState(['visiblePans']),
    nextPanName() {
      const currentIndex = this.visiblePans.indexOf(this.pan)
      return this.visiblePans[currentIndex + 1]
    }
  },
  methods: {
    updateNextPan(style) {
      Event.$emit(`set-${this.nextPanName}-pan-style`, style)
    },
    updateCurrentPan(style) {
      Event.$emit(`set-${this.pan}-pan-style`, style)
    },
    getNextVisiblePan(current) {
      const next = current.nextElementSibling
      if (next && next.style.display === 'none') {
        return this.getNextVisiblePan(next)
      }
      return next
    },
    handleMouseDown() {
      this.resizing = true
      this.currentPan = this.$refs.resizer.parentNode
      this.nextPan = this.getNextVisiblePan(this.currentPan)
      this.originalNextPanTop = parseFloat(this.nextPan.style.top)
      this.originalNextPanBottom = parseFloat(this.nextPan.style.bottom)
      this.originalCurrentPanBottom = parseFloat(this.currentPan.style.bottom)
      this.originalCurrentPanTop = parseFloat(this.currentPan.style.top)

      document.addEventListener('pointermove', this.handleMouseMove)
      document.addEventListener('pointerup', this.handleMouseUp)

      this.currentPan.parentNode.classList.add('resizing')
      document
        .getElementById('output-iframe')
        .classList.add('disable-mouse-events')
    },
    handleMouseUp() {
      this.resizing = false

      document.removeEventListener('pointermove', this.handleMouseMove)
      document.removeEventListener('pointerup', this.handleMouseUp)

      this.currentPan.parentNode.classList.remove('resizing')
      document
        .getElementById('output-iframe')
        .classList.remove('disable-mouse-events')

      Event.$emit('refresh-editor', { run: false })
    },
    handleMouseMove(e) {
      e.preventDefault()
      if (this.resizing) {
        const newNextPanTop = (e.clientY / window.innerHeight) * 100
        if (
          newNextPanTop - this.originalCurrentPanTop > 5 &&
          100 - newNextPanTop - this.originalNextPanBottom > 5
        ) {
          this.updateNextPan({ top: `${newNextPanTop}%` })
          const newCurrentPanBottom =
            this.originalCurrentPanBottom -
            (newNextPanTop - this.originalNextPanTop)
          this.updateCurrentPan({ bottom: `${newCurrentPanBottom}%` })
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.pan-resizer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-bottom: 1px solid #e2e2e2;
  border-top: 3px solid transparent;
  height: 1px;
  z-index: 1000;

  &.enable:hover {
    cursor: ns-resize;
    border-bottom: 1px dashed #39f;
  }
}
</style>
