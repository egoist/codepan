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

<style>
  html, body, #app, .page {
    height: 100%;
  }
  body {
    background-color: #f9f9f9;
    margin: 0;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  }
  * {
    box-sizing: border-box;
  }

  .el-dropdown-link {
    cursor: pointer;
    user-select: none;
  }
</style>

<style src="nprogress/nprogress.css"></style>
