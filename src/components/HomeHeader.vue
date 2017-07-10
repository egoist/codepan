<template>
  <header class="home-header">
    <div class="home-header-left home-header-block">
      <el-dropdown
        @command="setBoilerplate"
        trigger="click"
        class="home-header-left-item">
        <el-button icon="document" size="mini">Boilerplates</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="empty">Empty</el-dropdown-item>
          <el-dropdown-item command="vue">Vue</el-dropdown-item>
          <el-dropdown-item command="vue-jsx">Vue JSX</el-dropdown-item>
          <el-dropdown-item command="react">React</el-dropdown-item>
          <el-dropdown-item command="preact">Preact</el-dropdown-item>
          <el-dropdown-item command="rxjs">RxJS</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        class="home-header-left-item"
        icon="plus"
        @click="promptLibrary"
        size="mini">
        Add library
      </el-button>
    </div>
    <div class="home-header-middle home-header-block pan-toggles">
      <span
        class="pan-toggle"
        :class="{visible: isVisible('html')}"
        @click="togglePan('html')">
        HTML
      </span>
      <span
        class="pan-toggle"
        :class="{visible: isVisible('css')}"
        @click="togglePan('css')">
        CSS
      </span>
      <span
        class="pan-toggle"
        :class="{visible: isVisible('js')}"
        @click="togglePan('js')">
        JS
      </span>
      <span
        class="pan-toggle"
        :class="{visible: isVisible('console')}"
        @click="togglePan('console')">
        <el-badge
          :is-dot="totalLogsCount > 0">
          Console
        </el-badge>
      </span>
      <span
        class="pan-toggle"
        :class="{visible: isVisible('output')}"
        @click="togglePan('output')">
        Output
      </span>
    </div>
    <div class="home-header-right home-header-block">
      <el-button
        icon="caret-right"
        size="mini"
        type="primary"
        class="home-header-right-item"
        @click="runCode">
        Run (CMD+S)
      </el-button>
      <el-dropdown
        class="home-header-right-item home-header-more"
        trigger="click">
        <el-button icon="more" size="mini"></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item style="padding: 0;">
            <a class="el-dropdown-menu__item" target="_blank" href="https://github.com/egoist/codepan">GitHub</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { Button, Input, Badge, Dropdown, DropdownMenu, DropdownItem, MessageBox } from 'element-ui'
  import Event from '@/utils/event'

  export default {
    computed: {
      ...mapState(['visiblePans']),
      ...mapState({
        totalLogsCount: state => state.logs.length
      })
    },
    mounted() {
      window.addEventListener('keydown', this.handleKeydown)
    },
    beforeDestroy() {
      window.removeEventListener('keydown', this.handleKeydown)
    },
    methods: {
      ...mapActions(['togglePan', 'updateCode']),
      handleKeydown(e) {
        if (e.which === 83 && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          this.runCode()
        }
      },
      async promptLibrary() {
        const { value } = await MessageBox.prompt('Type an npm package name:', 'Add Library', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel'
        })
        this.addLibrary(value)
      },
      async addLibrary(name) {
        if (name) {
          const code = `&lt;script src="https://unpkg.com/${name}">&lt;/script>\n`.replace(/&lt;/g, '<') + this.$store.state.html.code
          await this.updateCode({ type: 'html', code })
          Event.$emit('refresh-editor')
        }
      },
      async setBoilerplate(boilerplate) {
        this.$router.push({
          name: 'boilerplate',
          params: {
            boilerplate
          }
        })
      },
      isVisible(pan) {
        return this.visiblePans.indexOf(pan) !== -1
      },
      runCode() {
        Event.$emit('run')
      }
    },
    components: {
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      'el-button': Button,
      'el-input': Input,
      'el-badge': Badge
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

  .home-header-left {
    display: flex;
    justify-content: flex-start;
    .home-header-left-item {
      margin-right: 10px;
    }
  }

  .home-header-right {
    display: flex;
    justify-content: flex-end;
    .home-header-right-item {
      margin-left: 10px;
    }
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
      position: relative;
      padding: 0 10px;
      cursor: pointer;
      user-select: none;

      &:not(:first-child) {
        margin-left: -1px;
      }

      &:hover {
        &:not(.visible) {
          background-color: #f9f9f9;
        }
      }

      &.visible {
        background-color: #EBF3FF;
      }
    }
  }
</style>
