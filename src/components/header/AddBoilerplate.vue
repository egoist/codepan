<template>
  <el-dropdown @command="setBoilerplate" trigger="click" class="home-header-left-item">
    <el-button icon="el-icon-star-on">Boilerplates</el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="empty">Empty</el-dropdown-item>
      <el-dropdown-item command="vue">Vue</el-dropdown-item>
      <el-dropdown-item command="vue-jsx">Vue JSX</el-dropdown-item>
      <el-dropdown-item command="react">React</el-dropdown-item>
      <el-dropdown-item command="preact">Preact</el-dropdown-item>
      <el-dropdown-item command="rxjs">RxJS</el-dropdown-item>
      <el-dropdown-item command="svelte">Svelte</el-dropdown-item>
      <el-dropdown-item command="hyperapp">Hyperapp</el-dropdown-item>
      <el-dropdown-item command="es-import">ES import</el-dropdown-item>
      <el-dropdown-item command="rust">Rust</el-dropdown-item>
      <el-dropdown-item command="pixi">Pixi</el-dropdown-item>
      <el-dropdown-item command="local-storage">Local Storage</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { Button, Dropdown, DropdownMenu, DropdownItem } from 'element-ui'

export default {
  components: {
    'el-button': Button,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem
  },
  methods: {
    async setBoilerplate(boilerplate) {
      this.$router.push({
        name: 'boilerplate',
        params: {
          boilerplate
        }
      })
    }
  }
}
</script>
