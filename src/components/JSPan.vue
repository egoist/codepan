<template>
  <div
    class="js-pan"
    :class="{ 'active-pan': isActivePan }"
    :style="style"
    @click="setActivePan('js')"
  >
    <div class="pan-head">
      <el-dropdown trigger="click" @command="setTransformer">
        <span class="el-dropdown-link">
          {{ humanlizedTransformerName }}
          <i class="el-icon-caret-bottom el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="js"> JavaScript </el-dropdown-item>
          <el-dropdown-item command="babel"> Babel </el-dropdown-item>
          <el-dropdown-item command="typescript"> TypeScript </el-dropdown-item>
          <el-dropdown-item command="vue-jsx"> Vue JSX </el-dropdown-item>
          <el-dropdown-item command="svelte"> Svelte </el-dropdown-item>
          <el-dropdown-item command="reason"> Reason </el-dropdown-item>
          <el-dropdown-item command="coffeescript-2">
            CoffeeScript 2
          </el-dropdown-item>
          <el-dropdown-item command="rust"> Rust </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="pan-head-right">
        <compiled-code-switcher v-if="js.code" type="js" />
      </div>
    </div>
    <textarea ref="editor" v-model="js.code" />
  </div>
</template>

<script>
import createPan from "@/utils/create-pan";

export default createPan({
  name: "js",
  editor: {
    mode: "jsx",
    autofocus: true,
    autoCloseBrackets: true,
  },
});
</script>
