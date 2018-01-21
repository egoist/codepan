<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style src="nprogress/nprogress.css"></style>
<style src="vue-slim-modal/themes/default.css"></style>
<style src="v-tippy/dist/tippy.css"></style>
<style src="notie/dist/notie.min.css"></style>


<style lang="stylus">
html, body, #app, .page
  height: 100%

body
  background-color: #f9f9f9
  margin: 0
  font-size: 14px
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif

*
  box-sizing: border-box

pre
  padding: 16px
  overflow: auto
  font-size: 85%
  line-height: 1.45
  background-color: #f6f8fa
  border-radius: 3px

pre > code
  padding: 0
  margin: 0
  font-size: 100%
  word-break: normal
  white-space: pre
  background: transparent
  border: 0

.el-dropdown-link
  cursor: pointer
  user-select: none

#nprogress
  z-index: 9999
  position: relative

.el-dropdown-menu
  .fake-anchor
    color: #333
    text-decoration: none
    align-items: center
    display: flex
    width: 100%
    svg
      margin-right: 10px
      width: 16px
      height: @width
      color: #666

.el-badge
  z-index: 1000

.notie-container
  z-index: 9999

#HW_frame_cont.HW_visible
  z-index: 9999

.update-notifier
  .el-notification__content
    text-align: left

.notie-overlay
  z-index: 9900
</style>
