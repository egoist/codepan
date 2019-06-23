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
  font-family: Tahoma, Verdana, Arial, sans-serif !important
  background-color: #f9f9f9
  margin: 0
  font-size: 14px

*
  box-sizing: border-box

.el-checkbox__label
.el-badge
  font-size: 1em !important

.el-button
.el-checkbox
  box-shadow: 0 0 1px rgba(0,0,0,0.15) inset
  font-family: Tahoma, Verdana, Arial, sans-serif !important
  font-size: 14px !important
  border-radius: 0 !important
  border: none !important
  line-height: 40px
  padding: 10px !important
  height: 40px !important
  margin: 0 !important

  i + span:not(:empty)
    margin-left: 5px !important

.home-header
  i[class*=" el-icon-"]
  i[class^="el-icon-"]
    font-size: 1.5em !important
    vertical-align: middle
    margin-top: -1px 
    margin-bottom: 1px

.el-checkbox__inner
  width: 15px !important
  height: 15px !important

.el-checkbox__inner::after
  height: 8px !important
  width: 4px !important

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

@media screen and (max-width: 768px)
  .home-header-block
    .el-button
      span
        display: none !important

  .el-message-box
    max-width: 100%

  .el-dropdown-menu
    z-index: 9999
</style>
