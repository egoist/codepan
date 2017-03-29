<template>
  <div
    class="html-pan"
    :class="{ 'highlight-pan': isHighlightPan }"
    @click="setHighlightPan('html')"
    :style="style">
    <div class="pan-head">
      <el-dropdown @command="setTransformer" trigger="click">
        <span class="el-dropdown-link">
          {{ html.transformer }} <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="HTML">HTML</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <textarea ref="editor">{{ html.code }}</textarea>
    <pan-resizer :enable="enableResizer" />
  </div>
</template>

<script>
  import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
  import createPan from '@/utils/create-pan'
  import PanResizer from '@/components/PanResizer.vue'

  export default createPan({
    name: 'html',
    editor: {
      mode: 'xml'
    },
    components: {
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      'pan-resizer': PanResizer
    }
  })
</script>
