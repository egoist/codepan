import Vue from 'vue'
import Vuex from 'vuex'
import { loadBabel, loadPug, loadMarkdown, loadSvelte, loadReason, loadCoffeeScript2, loadCssnext, loadLess, loadSass } from '@/utils/transformer'
import progress from 'nprogress'
import axios from 'axios'
import req from 'reqjs'
import Event from '@/utils/event'
import notie from 'notie'

Vue.use(Vuex)

const pans = ['html', 'css', 'js', 'console', 'output']
const sortPans = ps => {
  return ps.sort((a, b) => {
    return pans.indexOf(a) > pans.indexOf(b)
  })
}

const emptyPans = () => ({
  js: {
    code: '',
    transformer: 'js'
  },
  css: {
    code: '',
    transformer: 'css'
  },
  html: {
    code: '',
    transformer: 'html'
  }
})

const getFileNameByLang = {
  html: 'index.html',
  js: 'script.js',
  css: 'style.css'
}

// Load entries of all boilerplates
const boilerplates = {
  empty: async () => ({
    ...emptyPans(),
    showPans: ['html', 'js', 'output']
  })
}
function importAll(r) {
  r.keys().forEach(key => {
    const name = /^\.\/(.+)\//.exec(key)[1]
    boilerplates[name] = r(key).default
  })
}
importAll(require.context('@/boilerplates', true, /index.js$/))

const store = new Vuex.Store({
  state: {
    ...emptyPans(),
    logs: [],
    visiblePans: ['html', 'js', 'output'],
    activePan: 'js',
    autoRun: false,
    githubToken: localStorage.getItem('codepan:gh-token') || '',
    editorStatus: 'saved',
    iframeStatus: null
  },
  mutations: {
    UPDATE_CODE(state, { type, code }) {
      state[type].code = code
    },
    UPDATE_TRANSFORMER(state, { type, transformer }) {
      state[type].transformer = transformer
    },
    ADD_LOG(state, log) {
      state.logs.push(log)
    },
    CLEAR_LOGS(state) {
      state.logs = []
    },
    TOGGLE_PAN(state, pan) {
      const pans = state.visiblePans
      const idx = pans.indexOf(pan)
      if (idx === -1) {
        pans.push(pan)
      } else {
        pans.splice(idx, 1)
      }
      state.visiblePans = sortPans(pans)
    },
    SHOW_PANS(state, pans) {
      state.visiblePans = sortPans(pans)
    },
    ACTIVE_PAN(state, pan) {
      state.activePan = pan
    },
    SET_GITHUB_TOKEN(state, token) {
      state.githubToken = token
    },
    SET_EDITOR_STATUS(state, status) {
      state.editorStatus = status
    },
    SET_AUTO_RUN(state, status) {
      state.autoRun = status
    },
    SET_IFRAME_STATUS(state, status) {
      state.iframeStatus = status
    }
  },
  actions: {
    updateCode({ commit }, payload) {
      commit('UPDATE_CODE', payload)
    },
    updateError({ commit }, payload) {
      commit('UPDATE_ERROR', payload)
    },
    addLog({ commit }, payload) {
      commit('ADD_LOG', payload)
    },
    clearLogs({ commit }) {
      commit('CLEAR_LOGS')
    },
    setActivePan({ commit }, pan) {
      commit('ACTIVE_PAN', pan)
    },
    togglePan({ commit }, payload) {
      commit('TOGGLE_PAN', payload)
    },
    showPans({ commit }, pans) {
      commit('SHOW_PANS', pans)
    },
    async updateTransformer({ commit }, { type, transformer }) {
      if (
        transformer === 'babel' ||
        transformer === 'typescript' ||
        transformer === 'jsx' || // @deprecated, use "babel"
        transformer === 'vue-jsx'
      ) {
        await loadBabel()
      } else if (transformer === 'pug') {
        await loadPug()
      } else if (transformer === 'markdown') {
        await loadMarkdown()
      } else if (transformer === 'svelte') {
        await loadSvelte()
      } else if (transformer === 'reason') {
        await loadReason()
      } else if (transformer === 'coffeescript-2') {
        await loadCoffeeScript2()
      } else if (transformer === 'cssnext') {
        await loadCssnext()
      } else if (transformer === 'less') {
        await loadLess()
      } else if (transformer === 'sass' || transformer === 'scss') {
        await loadSass()
      }
      commit('UPDATE_TRANSFORMER', { type, transformer })
    },
    // todo: simplify this action
    async setBoilerplate({ dispatch }, boilerplate) {
      progress.start()

      if (typeof boilerplate === 'string') {
        boilerplate = await boilerplates[boilerplate]()
      }

      const ps = []

      const defaultPans = emptyPans()

      for (const type of ['html', 'js', 'css']) {
        const { code, transformer } = {
          code: defaultPans[type].code,
          transformer: defaultPans[type].transformer,
          ...boilerplate[type]
        }
        ps.push(
          dispatch('updateCode', { type, code }),
          dispatch('updateTransformer', {
            type,
            transformer
          })
        )
      }

      if (boilerplate.showPans) {
        ps.push(dispatch('showPans', boilerplate.showPans))
      }

      const { activePan = 'js' } = boilerplate
      ps.push(dispatch('setActivePan', activePan))
      ps.push(dispatch('clearLogs'))

      await Promise.all(ps)

      setTimeout(() => {
        dispatch('editorSaved')
        Event.$emit('focus-editor', activePan)
      })

      progress.done()
    },
    async setGist({ commit, dispatch, state }, id) {
      const params = {
        // eslint-disable-next-line camelcase
        access_token: state.githubToken
      }

      let files
      try {
        files = await axios.get(`https://api.github.com/gists/${id}`, {
          params
        }).then(res => res.data.files)
      } catch (err) {
        progress.done()
        if (err.response) {
          const { headers, status } = err.response
          if (!state.githubToken && status === 403 && headers['x-ratelimit-remaining'] === '0') {
            notie.confirm({
              text: 'API rate limit exceeded, do you want to login?',
              submitCallback() {
                Event.$emit('showLogin')
              }
            })
          } else {
            notie.alert({
              type: 'error',
              text: err.response.data.message,
              time: 5
            })
          }
        } else {
          notie.alert({
            type: 'error',
            text: err.message || 'GitHub API Error'
          })
        }
      }

      if (!files) return

      const main = {
        html: {},
        css: {},
        js: {},
        ...(files['index.js'] ? req(files['index.js'].content) : {}),
        ...(files['codepan.js'] ? req(files['codepan.js'].content) : {}),
        ...(files['codepan.json'] ? JSON.parse(files['codepan.json'].content) : {})
      }
      for (const type of ['html', 'js', 'css']) {
        if (!main[type].code) {
          const filename = main[type].filename || getFileNameByLang[type]
          if (files[filename]) {
            main[type].code = files[filename].content
          }
        }
      }
      await dispatch('setBoilerplate', main)
    },
    setGitHubToken({ commit }, token) {
      commit('SET_GITHUB_TOKEN', token)
      if (token) {
        localStorage.setItem('codepan:gh-token', token)
      } else {
        localStorage.removeItem('codepan:gh-token')
      }
    },
    editorSaved({ commit }) {
      commit('SET_EDITOR_STATUS', 'saved')
    },
    editorChanged({ commit }) {
      commit('SET_EDITOR_STATUS', 'changed')
    },
    editorSaving({ commit }) {
      commit('SET_EDITOR_STATUS', 'saving')
    },
    editorSavingError({ commit }) {
      commit('SET_EDITOR_STATUS', 'error')
    },
    setAutoRun({ commit }, status) {
      commit('SET_AUTO_RUN', status)
    },
    setIframeStatus({ commit }, status) {
      commit('SET_IFRAME_STATUS', status)
    }
  }
})

export default store
