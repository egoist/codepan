<template>
  <div class="comments-wrapper">
    <div v-if="loading">Loading...</div>
    <div class="comments">
      <div class="comment" :key="comment.id" v-for="comment in comments">
        <div class="comment-avatar">
          <img width="50" :src="comment.user.avatar_url">
        </div>
        <div class="comment-main">
          <h3 class="comment-username">{{ comment.user.login }}</h3>
          <div class="comment-body">{{ comment.body }}</div>
        </div>
      </div>
    </div>
    <div class="add-comment">
      <el-input
        type="textarea"
        :rows="5"
        v-model="text">
      </el-input>
      <div class="comment-actions">
        <el-button type="primary" plain @click="addComment">Add comment</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Button, Input } from 'element-ui'

export default {
  components: {
    'el-button': Button,
    'el-input': Input
  },

  data() {
    return {
      comments: [],
      loading: true,
      text: ''
    }
  },

  created() {
    this.getComments()
  },

  methods: {
    async getComments() {
      this.loading = true
      const gist = this.$route.params.gist
      const { data } = await axios.get(`https://api.github.com/gists/${gist}/comments?access_token=${this.$store.state.githubToken || ''}`)
      this.comments = data
      this.loading = false
    },

    addComment() {

    }
  }
}
</script>

<style scoped lang="stylus">
.comment
  display: flex
  padding: 10px 0
  &:not(:last-child)
    border-bottom: 1px solid #e2e2e2

.comment-avatar
  margin-right: 10px
  img
    border-radius: 3px

.comment-username
  margin: 0
  line-height: 1

.comment-body
  margin-top: 5px

.comment-actions
  margin-top: 20px

.add-comment
  margin-top: 20px
</style>
