<template>
  <div
    class="pan-resizer"
    :class="{ enable }"
    ref="resizer"
    @mousedown="handleMouseDown">
  </div>
</template>

<script>
  import Event from '@/utils/event'
  import { mapState } from 'vuex'

  export default {
    props: ['enable', 'pan'],
    data() {
      return {
        resizing: false,
        originalNextPanLeft: null,
        originalNextPanRight: null,
        originalCurrentPanRight: null,
        originalCurrentPanLeft: null,
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
        this.originalNextPanLeft = parseFloat(this.nextPan.style.left)
        this.originalNextPanRight = parseFloat(this.nextPan.style.right)
        this.originalCurrentPanRight = parseFloat(this.currentPan.style.right)
        this.originalCurrentPanLeft = parseFloat(this.currentPan.style.left)

        document.addEventListener('mousemove', this.handleMouseMove)
        document.addEventListener('mouseup', this.handleMouseUp)

        this.currentPan.parentNode.classList.add('resizing')
        document.getElementById('output-iframe').classList.add('disable-mouse-events')
      },
      handleMouseUp() {
        this.resizing = false

        document.removeEventListener('mousemove', this.handleMouseMove)
        document.removeEventListener('mouseup', this.handleMouseUp)

        this.currentPan.parentNode.classList.remove('resizing')
        document.getElementById('output-iframe').classList.remove('disable-mouse-events')

        Event.$emit('refresh-editor', { run: false })
      },
      handleMouseMove(e) {
        if (this.resizing) {
          e.preventDefault()
          const newNextPanLeft = e.clientX / window.innerWidth * 100
          if (
             (newNextPanLeft - this.originalCurrentPanLeft > 5) &&
            (100 - newNextPanLeft - this.originalNextPanRight > 5)
          ) {
            this.updateNextPan({ left: `${newNextPanLeft}%` })
            const newCurrentPanRight = this.originalCurrentPanRight - (newNextPanLeft - this.originalNextPanLeft)
            this.updateCurrentPan({ right: `${newCurrentPanRight}%` })
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.pan-resizer
  width: 5px
  position: absolute
  height: 100%
  top: 0
  right: 0
  border-right: 1px solid #e2e2e2
  z-index: 1000

  &.enable:hover
    cursor: move
    border-right: 1px dashed #39f
</style>
