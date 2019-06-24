<template>
  <div id="app">
    <router-view/>
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
html, body, #app, .page {
  height: 100%;
}

body {
  background-color: #f9f9f9;
  margin: 0;
  font-size: 14px;
  font-family: Arial;
}

* {
  box-sizing: border-box;
}

pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

pre > code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.el-dropdown-link {
  cursor: pointer;
  user-select: none;
}

#nprogress {
  z-index: 9999;
  position: relative;
}

.el-dropdown-menu {
  .fake-anchor {
    color: #333;
    text-decoration: none;
    align-items: center;
    display: flex;
    width: 100%;

    svg {
      margin-right: 10px;
      width: 16px;
      height: @width;
      color: #666;
    }
  }
}

.el-badge {
  z-index: 1000;
}

.notie-container {
  z-index: 9999;
}

#HW_frame_cont.HW_visible {
  z-index: 9999;
}

.update-notifier {
  .el-notification__content {
    text-align: left;
  }
}

.notie-overlay {
  z-index: 9900;
}

header, .run-buttons {
  display: flex;
  flex-wrap: wrap;

  &>* {
    flex-grow: 1;
  }
}

header {
  .el-button, .el-checkbox {
    font-variant: small-caps;
    color: #409EFF !important;
    background: none !important;
    height: 50px !important;
    vertical-align: top;
    margin: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    padding: 12px 16px !important;

    span {
      vertical-align: middle;
    }

    .el-checkbox__label {
      line-height: 26px !important;
    }
  }

  .el-checkbox:hover, .el-button:hover {
    color: black !important;
  }

  .el-checkbox:focus, .el-button:focus, .el-checkbox:active, .el-button:active {
    background: lightblue !important;
    color: white !important;
  }

  span.el-checkbox__inner, i[class^='el-icon'] {
    transform: scale(1.5);
    margin: -1px 5px 1px 0;
    vertical-align: middle;
  }

  [class*=el-icon-] {
    margin: 5px !important;
  }

  [class*=el-icon-]+* {
    display: inline-block;
  }
}

.pan-head {
  padding: 10px;
  height: 36px;
  font-size: 14px;
}

.pan-head svg {
  top: 6px;
  right: 8px;
  cursor: pointer;
  position: absolute;
  transform: scale(0.5);
}

.CodeMirror {
  height: calc(100% - 36px) !important;
}

.CodeMirror-lines {
  padding: 0 !important;
}

.console-pan .pan-head button {
  vertical-align: top;
  margin-top: -2px;
  float: right;
}

.compiled-code-dialog {
  width: calc(100% - 20px) !important;
  max-width: 800px !important;
}

@media (max-width: 768px) {
  body {
    font-size: 12px;
  }

  .el-checkbox .el-checkbox__label, .el-button span {
    display: none;
  }

  .el-checkbox__inner {
    margin: 5px !important;
  }
}
</style>
