<template>
  <section>
    <el-dropdown
      v-if="!inIframe"
      class="home-header-right-item home-header-more"
      @command="handleDropdownCommand"
      trigger="click"
    >
      <el-button
        :icon="isLoggedIn ? 'el-icon-lock' : 'el-icon-unlock'"
      >{{ isLoggedIn ? username : '' }}</el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="github-login">
          <div class="fake-anchor">
            <log-out-icon v-if="githubToken"/>
            <github-icon v-else/>
            GitHub {{ githubToken ? 'Logout' : 'Login' }}
          </div>
        </el-dropdown-item>
        <el-dropdown-item
          :disabled="editorStatus === 'saving'"
          command="save-new-gist"
          title="Create a new gist from editor"
          v-tippy="{position: 'left',arrow: true}"
          v-if="canUpdateGist"
        >
          <div class="fake-anchor">
            <git-branch-icon></git-branch-icon>Save new
          </div>
        </el-dropdown-item>
        <el-dropdown-item style="padding: 0;">
          <a
            class="el-dropdown-menu__item fake-anchor"
            target="_blank"
            href="https://github.com/egoist/codepan"
          >
            <link2-icon></link2-icon>Source Code
          </a>
        </el-dropdown-item>
        <el-dropdown-item style="padding: 0;">
          <a
            class="el-dropdown-menu__item fake-anchor"
            target="_blank"
            href="https://twitter.com/_egoistlily"
          >
            <twitter-icon></twitter-icon>Follow me on Twitter
          </a>
        </el-dropdown-item>
        <el-dropdown-item style="padding: 0;">
          <a
            target="_blank"
            class="el-dropdown-menu__item fake-anchor"
            :href="`https://github.com/egoist/codepan/commit/${latestCommit}`"
          >
            <info-icon></info-icon>
            {{ version }}
          </a>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <a
      title="Edit on CodePan"
      v-tippy
      v-if="inIframe"
      class="home-header-right-item"
      :href="url"
      target="_blank"
    >
      <img height="30" src="/favicon-180.png" alt="codepan">
    </a>
  </section>
</template>


<script>
import { mapState, mapGetters } from 'vuex'
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'element-ui'
import Event from '@/utils/event'
import popup from '@/utils/popup'
import { inIframe } from '@/utils'
import notie from 'notie'
import {
  GithubIcon,
  Link2Icon,
  TwitterIcon,
  InfoIcon
} from 'vue-feather-icons'

export default {
  data() {
    return {
      version: process.env.VERSION,
      latestCommit: process.env.LATEST_COMMIT,
      inIframe,
      url: window.location.href
    }
  },
  computed: {
    ...mapState(['githubToken', 'editorStatus', 'autoRun', 'iframeStatus']),
    ...mapState({
      totalLogsCount: state => state.logs.length,
      username: state => state.userMeta && state.userMeta.login
    }),
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
  mounted() {
    Event.$on('showLogin', () => this.githubLogin())
  },
  methods: {
    handleDropdownCommand(command) {
      if (command === 'save-new-gist') {
        Event.$emit('save-gist', true)
      } else if (command === 'github-login') {
        if (this.githubToken) {
          this.$store.dispatch('setGitHubToken', null)
          notie.alert({
            type: 'success',
            text: `Done, you've been successfully logged out!`
          })
        } else {
          this.githubLogin()
        }
      }
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
    'el-button': Button,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    GithubIcon,
    Link2Icon,
    TwitterIcon,
    InfoIcon
  }
}
</script>

<style lang="stylus" scoped>
.el-button [class*=el-icon-]+span:empty {
  display: none !important;
  margin: 0 !important;
}
</style>
