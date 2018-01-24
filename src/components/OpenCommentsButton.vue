<template>
  <div class="open-comments">
    <el-button
      @click="toggleComments"
      class="comment-icon"
      size="mini">
      <message-icon></message-icon> 0
    </el-button>
    <el-dialog title="Comments" :visible.sync="showComments">
      <comments></comments>
    </el-dialog>
  </div>
</template>

<script>
import { Button, Dialog } from 'element-ui'
import { MessageIcon } from 'vue-bytesize-icons'
import axios from 'axios'
import Comments from './Comments.vue'

export default {
  components: {
    'el-button': Button,
    'el-dialog': Dialog,
    MessageIcon,
    Comments
  },

  data() {
    return {
      showComments: false
    }
  },

  methods: {
    toggleComments() {
      this.showComments = !this.showComments
    }
  }
}
</script>

<style lang="stylus" scoped>
.open-comments
  >>> > button
    height: 28px
  >>> span
    display: flex
    align-items: center
    justify-content: center
</style>
