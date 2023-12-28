<template>
  <el-button
    v-if="!inIframe"
    v-tippy="{position: 'bottom'}"
    :icon="editorStatus === 'saving' ? 'el-icon-loading' : 'el-icon-upload'"
    plain
    :disabled="editorStatus === 'saving'"
    :title="saveButtonTitle"
    class="home-header-right-item"
    @click="saveGist"
  >
    Save
  </el-button>
</template>

<script>
import Event from '@/utils/event'
import { mapState, mapGetters } from 'vuex'
import { Button } from 'element-ui'
import notie from 'notie'
import { inIframe } from '@/utils'
import popup from '@/utils/popup'

export default {
  data() {
    return {
      inIframe
    }
  },
  computed: {
    ...mapState(['editorStatus', 'iframeStatus']),
    ...mapGetters(['isLoggedIn', 'canUpdateGist']),
    iframeStatusIcon() {
      switch (this.iframeStatus) {
      case 'loading':
        return 'el-icon-loading'
      case 'error':
        return 'el-icon-warning'
      default:
        return 'el-icon-caret-right'
      }
    },
    saveButtonTitle() {
      if (this.isLoggedIn) {
        return this.canUpdateGist ? 'Update this gist' : 'Create new gist'
      }
      return 'Login to save'
    }
  },
  methods: {
    runCode() {
      Event.$emit('run')
    },
    saveGist() {
      if (!this.isLoggedIn) {
        return this.githubLogin()
      }
      Event.$emit('save-gist')
    },
    githubLogin() {
      notie.select({
        text: 'Choose the way to login to GitHub',
        choices: [
          {
            text: 'Token',
            handler: () => {
              this.promptGitHubToken()
            }
          },
          {
            text: 'OAuth',
            type: 2,
            handler: () => {
              const loginURL =
                process.env.NODE_ENV === 'development' ?
                  'http://localhost:4001/login' :
                  'https://gh-login.codepan.net/login'

              popup(loginURL, 'gh login', 600, 400)
            }
          }
        ]
      })
    },
    promptGitHubToken() {
      notie.input({
        text: 'Please set your personal access token for GitHub Gist',
        submitCallback: value => {
          this.$store.dispatch('setGitHubToken', value)
          notie.alert({
            type: 'success',
            time: 6,
            text:
              'Done, now you can save your code to GitHub Gist under your account!'
          })
        }
      })
    }
  },
  components: {
    'el-button': Button
  }
}
</script>
