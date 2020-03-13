<template>
  <header class="home-header">
    <div class="home-header-left home-header-block">
      <el-dropdown
        @command="setBoilerplate"
        trigger="click"
        class="home-header-left-item">
        <el-button
          icon="el-icon-document"
          size="mini">
          Boilerplates
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="empty">Empty</el-dropdown-item>
          <el-dropdown-item command="vue">Vue</el-dropdown-item>
          <el-dropdown-item command="vue-jsx">Vue JSX</el-dropdown-item>
          <el-dropdown-item command="react">React</el-dropdown-item>
          <el-dropdown-item command="preact">Preact</el-dropdown-item>
          <el-dropdown-item command="rxjs">RxJS</el-dropdown-item>
          <el-dropdown-item command="hyperapp">Hyperapp</el-dropdown-item>
          <el-dropdown-item command="es-import">ES import</el-dropdown-item>
          <el-dropdown-item command="rust">Rust</el-dropdown-item>
          <el-dropdown-item command="pixi">Pixi</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        v-if="!inIframe"
        class="home-header-left-item"
        style="margin-right:0"
        icon="el-icon-plus"
        @click="promptLibrary"
        size="mini">
        Add library
      </el-button>
      <span class="home-header-left-item changelog-indicator"></span>
    </div>
    <div class="home-header-middle home-header-block pan-toggles">
      <span
        class="pan-toggle"
        :class="{visible: isVisible('html')}"
        @click="togglePan('html')">
        HTML
      </span>
      <span
        class="pan-toggle"
        :class="{visible: isVisible('css')}"
        @click="togglePan('css')">
        CSS
      </span>
      <span
        class="pan-toggle"
        :class="{visible: isVisible('js')}"
        @click="togglePan('js')">
        JS
      </span>
      <span
        class="pan-toggle"
        :class="{visible: isVisible('console')}"
        @click="togglePan('console')">
        <el-badge
          :is-dot="totalLogsCount > 0">
          Console
        </el-badge>
      </span>
      <span
        class="pan-toggle"
        :class="{visible: isVisible('output')}"
        @click="togglePan('output')">
        Output
      </span>
    </div>
    <div class="home-header-right home-header-block">
      <el-checkbox
        border
        size="mini"
        :value="autoRun"
        v-if="!inIframe"
        @change="setAutoRun">
        Auto-run
      </el-checkbox>
      <el-button
        :icon="iframeStatusIcon"
        size="mini"
        :type="iframeStatus === 'error' ? 'danger' : 'primary'"
        class="home-header-right-item"
        plain
        @click="runCode">
        Run
      </el-button>
      <el-button
        v-if="!inIframe"
        :icon="editorStatus === 'saving' ? 'el-icon-loading' : 'el-icon-upload2'"
        size="mini"
        plain
        :disabled="editorStatus === 'saving'"
        :title="saveButtonTitle"
        v-tippy="{position: 'bottom'}"
        class="home-header-right-item"
        @click="saveGist">
        Save
      </el-button>
      <el-dropdown
        v-if="!inIframe"
        class="home-header-right-item home-header-more"
        @command="handleDropdownCommand"
        trigger="click">
        <el-button
          :icon="isLoggedIn ? '' : 'el-icon-more'"
          size="mini">
          {{ isLoggedIn ? username : '' }}
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <el-button
              v-if="!inIframe"
              :icon="editorStatus === 'saving' ? 'el-icon-loading' : 'el-icon-upload2'"
              size="mini"
              plain
              :disabled="editorStatus === 'saving'"
              :title="saveButtonTitle"
              v-tippy="{position: 'bottom'}"
              @click="saveGist">
              Save
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button
              :icon="iframeStatusIcon"
              size="mini"
              :type="iframeStatus === 'error' ? 'danger' : 'primary'"
              plain
              @click="runCode">
              Run
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-checkbox
              border
              size="mini"
              :value="autoRun"
              v-if="!inIframe"
              @change="setAutoRun">
              Auto-run
            </el-checkbox>
          </el-dropdown-item>
          <el-dropdown-item command="github-login">
            <div class="fake-anchor">
              <log-out-icon v-if="githubToken" />
              <github-icon v-else /> GitHub {{ githubToken ? 'Logout' : 'Login' }}
            </div>
          </el-dropdown-item>
          <el-dropdown-item
            :disabled="editorStatus === 'saving'"
            command="save-new-gist"
            title="Create a new gist from editor"
            v-tippy="{position: 'left',arrow: true}"
            v-if="canUpdateGist">
            <div class="fake-anchor">
              <git-branch-icon></git-branch-icon> Save new
            </div>
          </el-dropdown-item>
          <el-dropdown-item style="padding: 0;">
            <a class="el-dropdown-menu__item fake-anchor" target="_blank" href="https://github.com/egoist/codepan"><link2-icon></link2-icon> Source Code</a>
          </el-dropdown-item>
          <el-dropdown-item style="padding: 0;">
            <a class="el-dropdown-menu__item fake-anchor" target="_blank" href="https://twitter.com/_egoistlily"><twitter-icon></twitter-icon> Follow me on Twitter</a>
          </el-dropdown-item>
          <el-dropdown-item style="padding: 0;">
            <a
              target="_blank"
              class="el-dropdown-menu__item fake-anchor"
              :href="`https://github.com/egoist/codepan/commit/${latestCommit}`">
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
        target="_blank">
        <img height="30" src="/favicon-180.png" alt="codepan">
      </a>
    </div>
  </header>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex'
  import { Button, Input, Badge, Dropdown, DropdownMenu, DropdownItem, MessageBox, Checkbox } from 'element-ui'
  import Event from '@/utils/event'
  import popup from '@/utils/popup'
  import { inIframe } from '@/utils'
  import notie from 'notie'
  import {
    GithubIcon,
    GitBranchIcon,
    Link2Icon,
    SaveIcon,
    TwitterIcon,
    LogOutIcon,
    InfoIcon
  } from 'vue-feather-icons'
  import SvgIcon from './SvgIcon.vue'

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
      ...mapState(['visiblePans', 'githubToken', 'editorStatus', 'autoRun', 'iframeStatus']),
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
            return 'el-icon-refresh'
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
      window.addEventListener('keydown', this.handleKeydown)
      Event.$on('showLogin', () => this.githubLogin())
    },
    beforeDestroy() {
      window.removeEventListener('keydown', this.handleKeydown)
    },
    methods: {
      ...mapActions(['togglePan', 'updateCode']),
      handleKeydown(e) {
        if (e.which === 83 && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          this.runCode()
        }
      },
      setAutoRun(status) {
        this.$store.dispatch('setAutoRun', status)
      },
      async promptLibrary() {
        const { value } = await MessageBox.prompt('Type an npm package name:', 'Add Library', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel'
        })
        this.addLibrary(value)
      },
      async addLibrary(name) {
        if (name) {
          const code = `&lt;script src="https://unpkg.com/${name}">&lt;/script>\n`.replace(/&lt;/g, '<') + this.$store.state.html.code
          await this.updateCode({ type: 'html', code })
          Event.$emit('refresh-editor')
        }
      },
      async setBoilerplate(boilerplate) {
        this.$router.push({
          name: 'boilerplate',
          params: {
            boilerplate
          }
        })
      },
      isVisible(pan) {
        return this.visiblePans.indexOf(pan) !== -1
      },
      runCode() {
        Event.$emit('run')
      },
      saveGist() {
        if (!this.isLoggedIn) {
          return this.githubLogin()
        }
        Event.$emit('save-gist')
      },
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
          choices: [{
            text: 'Token',
            handler: () => {
              this.promptGitHubToken()
            }
          }, {
            text: 'OAuth',
            type: 2,
            handler: () => {
              const loginURL = process.env.NODE_ENV === 'development' ? 'http://localhost:4001/login' : 'https://gh-login.codepan.net/login'

              popup(loginURL, 'gh login', 600, 400)
            }
          }]
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
              text: 'Done, now you can save your code to GitHub Gist under your account!'
            })
          }
        })
      }
    },
    components: {
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      'el-button': Button,
      'el-input': Input,
      'el-badge': Badge,
      'el-checkbox': Checkbox,
      GithubIcon,
      GitBranchIcon,
      Link2Icon,
      SaveIcon,
      TwitterIcon,
      SvgIcon,
      LogOutIcon,
      InfoIcon
    }
  }
</script>

<style lang="stylus" scoped>
.home-header
  height: 40px;
  border-bottom: 1px solid #bfbfbf
  background-color: white
  display: flex
  align-items: center
  padding: 0 10px
  justify-content: space-between

.home-header-block
  flex: 1
  width: 0

.home-header-left
  display: flex
  justify-content: flex-start
  .home-header-left-item
    margin-right: 10px

.el-dropdown-menu__item > label, .el-dropdown-menu__item > button
  width: 100%
  display: none

.el-dropdown-menu__item > button
  text-align: left

@media screen and (max-width: 992px)
  .el-dropdown-menu__item > label
    display: inline-block

@media screen and (max-width: 576px)
  .el-dropdown-menu__item > button
    display: inline-block

.home-header-right
  display: flex
  justify-content: flex-end
  align-items: center
  .home-header-right-item
    margin-left: 10px
  @media screen and (max-width: 992px)
    > label
      display: none

  @media screen and (max-width: 576px)
    > button
      display: none

.changelog-indicator
  display: flex
  align-items: center
  height: 28px

.pan-toggles
  display: flex
  justify-content: center
  height: 100%

  .pan-toggle
    display: flex
    align-items: center
    height: 100%
    border-left: 1px solid #e2e2e2
    border-right: @border-left
    position: relative
    padding: 0 10px
    cursor: pointer
    user-select: none

    &:not(:first-child)
      margin-left: -1px

    &:hover
      &:not(.visible)
        background-color: #f9f9f9

    &.visible
      background-color: #EBF3FF

.editor-save-status
  display: flex
  align-items: center
  color: #607d8b
  .svg-icon
    display: flex
    align-items: center
    margin-right: 5px
  >>> svg
    fill: @color
    width: 16px
    height: @width

@media screen and (max-width: 768px)
  .home-header-left
    display: none
  .pan-toggles
    justify-content: left
</style>
