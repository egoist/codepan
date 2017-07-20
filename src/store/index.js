import Vue from 'vue'
import Vuex from 'vuex'
import { loadBabel, loadPug, loadMarkdown, loadSvelte } from '@/utils/transformer'
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
    autoRun: false
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
        transformer === 'babel' ||
        transformer === 'jsx' ||
        transformer === 'vue-jsx'
      ) {
        await loadBabel()
      } else if (transformer === 'pug') {
        await loadPug()
      } else if (transformer === 'markdown') {
        await loadMarkdown()
      } else if (transformer === 'svelte') {
        await loadSvelte()
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
          const filename = main[type].filename || getFileNameByLang[type]
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
