<template>
  <div
    class="pan-resizer"
    :class="{ enable }"
    ref="resizer"
    @mousedown="handleMouseDown">
  </div>
</template>

<script>
  export default {
    props: ['enable'],
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
    methods: {
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

        // prevent select
        document.onselectstart = () => false
      },
      handleMouseUp() {
        this.resizing = false

        document.removeEventListener('mousemove', this.handleMouseMove)
        document.removeEventListener('mouseup', this.handleMouseUp)

        this.currentPan.parentNode.classList.remove('resizing')
        document.getElementById('output-iframe').classList.remove('disable-mouse-events')

        // enable select
        document.onselectstart = () => false
      },
      handleMouseMove(e) {
        if (this.resizing) {
          const newNextPanLeft = e.clientX / window.innerWidth * 100
          if (
             (newNextPanLeft - this.originalCurrentPanLeft > 5) &&
            (100 - newNextPanLeft - this.originalNextPanRight > 5)
          ) {
            this.nextPan.style.left = `${newNextPanLeft}%`
            const newCurrentPanRight = this.originalCurrentPanRight - (newNextPanLeft - this.originalNextPanLeft)
            this.currentPan.style.right = `${newCurrentPanRight}%`
          }
        }
      }
    }
  }
</script>

<style scoped>
  .pan-resizer {
    width: 5px;
    position: absolute;
    height: 100%;
    top: 0;
    right: 0;
    border-right: 1px solid #e2e2e2;
    z-index: 1000;

    &.enable:hover {
      cursor: move;
      border-right: 1px dashed #39f;
    }
  }
</style>
