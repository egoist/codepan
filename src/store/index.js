import Vue from 'vue'
import Vuex from 'vuex'
import { loadBabel, loadPug, loadMarkdown } from '@/utils/transformer'
import progress from 'nprogress'
import axios from 'axios'
import req from 'reqjs'

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
    transformer: 'JavaScript'
  },
  css: {
    code: '',
    transformer: 'CSS'
  },
  html: {
    code: '',
    transformer: 'HTML'
  }
})

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
    activePan: 'js'
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
        transformer === 'Babel' ||
        transformer === 'JSX' ||
        transformer === 'Vue JSX'
      ) {
        await loadBabel()
      } else if (transformer === 'Pug') {
        await loadPug()
      } else if (transformer === 'Markdown') {
        await loadMarkdown()
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
      for (const type in boilerplate) {
        if (['html', 'js', 'css'].indexOf(type) !== -1) {
          const payload = boilerplate[type]
          if (typeof payload.code !== 'undefined') {
            ps.push(dispatch('updateCode', { type, code: payload.code }))
          }
          if (typeof payload.transformer !== 'undefined') {
            ps.push(
              dispatch('updateTransformer', {
                type,
                transformer: payload.transformer
              })
            )
          }
        } else if (type === 'showPans') {
          ps.push(dispatch('showPans', boilerplate.showPans))
        }
      }

      ps.push(dispatch('setActivePan', boilerplate.activePan || 'js'))
      ps.push(dispatch('clearLogs'))

      await Promise.all(ps)

      progress.done()
    },
    async setGist({ commit, dispatch }, id) {
      const { data: { files } } = await axios.get(`https://api.github.com/gists/${id}`)

      const main = {
        html: {},
        css: {},
        js: {},
        ...(files['index.js'] ? req(files['index.js'].content) : {})
      }
      for (const type of ['html', 'js', 'css']) {
        if (!main[type].code) {
          const filename = main[type].filename || `codepan.${type}`
          if (files[filename]) {
            main[type].code = files[filename].content
          }
        }
      }
      await dispatch('setBoilerplate', main)
    }
  }
})

export default store
