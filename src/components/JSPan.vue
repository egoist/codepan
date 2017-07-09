<template>
  <div
    class="js-pan"
    :class="{ 'active-pan': isActivePan }"
    @click="setActivePan('js')"
    :style="style">
    <div class="pan-head">
      <el-dropdown @command="setTransformer" trigger="click">
        <span class="el-dropdown-link">
          {{ js.transformer }} <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="js">JavaScript</el-dropdown-item>
          <el-dropdown-item command="babel">Babel</el-dropdown-item>
          <el-dropdown-item command="jsx">JSX</el-dropdown-item>
          <el-dropdown-item command="vue-jsx">Vue JSX</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <textarea ref="editor">{{ js.code }}</textarea>
    <pan-resizer pan="js" :enable="enableResizer" />
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
      autofocus: true,
      autoCloseBrackets: true
    },
    components: {
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      'pan-resizer': PanResizer
    }
  })
</script>
