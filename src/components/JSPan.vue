<template>
  <div
    class="js-pan"
    :class="{ 'highlight-pan': isHighlightPan }"
    @click="setHighlightPan('js')"
    :style="style">
    <div class="pan-head">
      <el-dropdown @command="setTransformer" trigger="click">
        <span class="el-dropdown-link">
          {{ js.transformer }} <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="JavaScript">JavaScript</el-dropdown-item>
          <el-dropdown-item command="Babel">Babel</el-dropdown-item>
          <el-dropdown-item command="JSX">JSX</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <textarea ref="editor">{{ js.code }}</textarea>
    <pan-resizer :enable="enableResizer" />
  </div>
</template>

<script>
  import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
  import createPan from '@/utils/create-pan'
  import PanResizer from '@/components/PanResizer.vue'

  export default createPan({
    name: 'js',
    editor: {
      mode: 'jsx',
      autofocus: true
    },
    components: {
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      'pan-resizer': PanResizer
    }
  })
</script>
