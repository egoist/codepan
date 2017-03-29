<template>
  <header class="home-header">
    <div class="home-header-left home-header-block">
      <el-dropdown @command="setBoilerplate" trigger="click">
        <el-button icon="document" size="mini">Boilerplates</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="empty">Empty</el-dropdown-item>
          <el-dropdown-item command="vue">Vue</el-dropdown-item>
          <el-dropdown-item command="react">React</el-dropdown-item>
          <el-dropdown-item command="preact">Preact</el-dropdown-item>
          <el-dropdown-item command="rxjs">RxJS</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="home-header-middle home-header-block pan-toggles">
      <span
        class="pan-toggle"
        :class="{active: isActive('html')}"
        @click="togglePan('html')">
        HTML
      </span>
      <span
        class="pan-toggle"
        :class="{active: isActive('css')}"
        @click="togglePan('css')">
        CSS
      </span>
      <span
        class="pan-toggle"
        :class="{active: isActive('js')}"
        @click="togglePan('js')">
        JS
      </span>
      <span
        class="pan-toggle"
        :class="{active: isActive('console')}"
        @click="togglePan('console')">
        Console
      </span>
      <span
        class="pan-toggle"
        :class="{active: isActive('output')}"
        @click="togglePan('output')">
        Output
      </span>
    </div>
    <div class="home-header-right home-header-block">
      <el-button
        icon="caret-right"
        size="mini"
        type="primary"
        @click="runCode">
        Run (CMD+S)
      </el-button>
    </div>
  </header>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { Button, Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
  import Event from '@/utils/event'

  export default {
    computed: {
      ...mapState(['activePans'])
    },
    mounted() {
      window.addEventListener('keydown', this.handleKeydown)
    },
    beforeDestroy() {
      window.removeEventListener('keydown', this.handleKeydown)
    },
    methods: {
      ...mapActions(['togglePan']),
      handleKeydown(e) {
        if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          this.runCode()
        }
      },
      async setBoilerplate(type) {
        await this.$store.dispatch('setBoilerplate', type)
        Event.$emit('refresh-editor')
      },
      isActive(pan) {
        return this.activePans.indexOf(pan) !== -1
      },
      runCode() {
        Event.$emit('run')
      }
    },
    components: {
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      'el-button': Button
    }
  }
</script>

<style scoped>
  .home-header {
    height: 40px;
    border-bottom: 1px solid #bfbfbf;
    background-color: white;
    display: flex;
    align-items: center;
    padding: 0 10px;
    justify-content: space-between;
  }

  .home-header-block {
    flex: 1;
    width: 0;
  }

  .home-header-right {
    display: flex;
    justify-content: flex-end;
  }

  .pan-toggles {
    display: flex;
    justify-content: center;
    height: 100%;

    .pan-toggle {
      display: flex;
      align-items: center;
      height: 100%;
      border-left: 1px solid #e2e2e2;
      border-right: @border-left;
      z-index: 1;
      position: relative;
      padding: 0 10px;
      cursor: pointer;
      user-select: none;

      &:not(:first-child) {
        margin-left: -1px;
      }

      &:hover {
        z-index: 2;
        &:not(.active) {
          background-color: #f9f9f9;
        }
      }

      &.active {
        background-color: #EBF3FF;
      }
    }
  }
</style>
