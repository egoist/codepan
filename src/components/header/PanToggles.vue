<template>
  <el-dropdown
    trigger="click"
    class="home-header-left-item"
    @command="togglePan"
  >
    <el-button icon="el-icon-thumb">
      Toggle Pans
    </el-button>
    <el-dropdown-menu
      slot="dropdown"
      class="pan-toggles"
    >
      <el-dropdown-item
        :class="{visible: isVisible('html')}"
        command="html"
      >
        HTML
      </el-dropdown-item>
      <el-dropdown-item
        :class="{visible: isVisible('css')}"
        command="css"
      >
        CSS
      </el-dropdown-item>
      <el-dropdown-item
        :class="{visible: isVisible('js')}"
        command="js"
      >
        JS
      </el-dropdown-item>
      <el-dropdown-item
        :class="{visible: isVisible('console')}"
        command="console"
      >
        <el-badge :is-dot="totalLogsCount > 0">
          Console
        </el-badge>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{visible: isVisible('output')}"
        command="output"
      >
        Output
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  Button,
  Badge,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'element-ui'

export default {
  components: {
    'el-button': Button,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    'el-badge': Badge
  },
  computed: {
    ...mapState(['visiblePans']),
    totalLogsCount: state => (state.logs ? state.logs.length : 0)
  },
  methods: {
    ...mapActions(['togglePan']),
    isVisible(pan) {
      return this.visiblePans.indexOf(pan) !== -1
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-badge {
  vertical-align: top;
}

.pan-toggles {
  &>*::before {
    content: '✔️';
    display: inline-block;
    margin-right: 6px;
  }

  &>*:not(.visible)::before {
    content: '✅';
  }
}
</style>