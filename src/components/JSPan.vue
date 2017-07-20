<template>
  <div
    class="js-pan"
    :class="{ 'active-pan': isActivePan }"
    @click="setActivePan('js')"
    :style="style">
    <div class="pan-head">
      <el-dropdown @command="setTransformer" trigger="click">
        <span class="el-dropdown-link">
          {{ humanlizedTransformerName }} <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="js">JavaScript</el-dropdown-item>
          <el-dropdown-item command="babel">Babel</el-dropdown-item>
          <el-dropdown-item command="jsx">JSX</el-dropdown-item>
          <el-dropdown-item command="vue-jsx">Vue JSX</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <compiled-code-switcher type="js" v-if="js.code"></compiled-code-switcher>
    </div>
    <textarea ref="editor">{{ js.code }}</textarea>
    <pan-resizer pan="js" :enable="enableResizer" />
  </div>
</template>

<script>
  import createPan from '@/utils/create-pan'

  export default createPan({
    name: 'js',
    editor: {
      mode: 'jsx',
      autofocus: true,
      autoCloseBrackets: true
    }
  })
</script>
