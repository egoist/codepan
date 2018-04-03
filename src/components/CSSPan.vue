<template>
  <div
    class="css-pan"
    :class="{ 'active-pan': isActivePan }"
    @click="setActivePan('css')"
    :style="style">
    <div class="pan-head">
      <el-dropdown @command="setTransformer" trigger="click">
        <span class="el-dropdown-link">
          {{ humanlizedTransformerName }} <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="css">CSS</el-dropdown-item>
          <el-dropdown-item command="cssnext">cssnext</el-dropdown-item>
          <el-dropdown-item command="less">LESS</el-dropdown-item>
          <el-dropdown-item command="sass">SASS</el-dropdown-item>
          <el-dropdown-item command="scss">SCSS</el-dropdown-item>
          <el-dropdown-item command="stylus">Stylus</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="pan-head-right">
        <compiled-code-switcher type="css" v-if="css.code"></compiled-code-switcher>
      </div>
    </div>
    <textarea ref="editor">{{ css.code }}</textarea>
    <pan-resizer pan="css" :enable="enableResizer" />
  </div>
</template>

<script>
import createPan from '@/utils/create-pan'

export default createPan({
  name: 'css',
  editor: {
    mode: 'css',
    autoCloseBrackets: true
  }
})
</script>
