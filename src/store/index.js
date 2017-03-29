import Vue from 'vue'
import Vuex from 'vuex'
import { babel, loadBabel } from '@/utils/transformer'
import progress from 'nprogress'

Vue.use(Vuex)

const pans = ['html', 'css', 'js', 'console', 'output']
const sortPans = ps => {
  return ps.sort((a, b) => {
    return pans.indexOf(a) > pans.indexOf(b)
  })
}

// Load entries of all boilerplates
const boilerplates = {}
function importAll(r) {
  r.keys().forEach(key => {
    const name = /^\.\/(.+)\//.exec(key)[1]
    boilerplates[name] = r(key).default
  })
}
importAll(require.context('@/boilerplates', true, /index.js$/))

const store = new Vuex.Store({
  state: {
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
    },
    logs: [],
    activePans: ['html', 'js', 'console']
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
      const pans = state.activePans
      const idx = pans.indexOf(pan)
      if (idx === -1) {
        pans.push(pan)
      } else {
        pans.splice(idx, 1)
      }
      state.activePans = sortPans(pans)
    },
    SHOW_PANS(state, pans) {
      state.activePans = sortPans(pans)
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
    togglePan({ commit }, payload) {
      commit('TOGGLE_PAN', payload)
    },
    showPans({ commit }, pans) {
      commit('SHOW_PANS', pans)
    },
    async updateTransformer({ commit }, { type, transformer }) {
      if (transformer === 'Babel' && !babel) {
        await loadBabel()
      }
      if (transformer === 'JSX' && !babel) {
        await loadBabel()
      }
      commit('UPDATE_TRANSFORMER', { type, transformer })
    },
    // todo: simplify this action
    async setBoilerplate({ dispatch }, type) {
      progress.start()

      const boilerplate = await boilerplates[type]()

      const ps = []
      for (const type in boilerplate) {
        if (['html', 'js', 'css'].indexOf(type) !== -1) {
          const payload = boilerplate[type]
          if (typeof payload.code !== 'undefined') {
            ps.push(dispatch('updateCode', { type, code: payload.code }))
          }
          if (typeof payload.transformer !== 'undefined') {
            ps.push(dispatch('updateTransformer', { type, transformer: payload.transformer }))
          }
        } else if (type === 'showPans') {
          ps.push(dispatch('showPans', boilerplate.showPans))
        }
      }

      ps.push(dispatch('clearLogs'))

      await Promise.all(ps)

      progress.done()
    }
  }
})

export default store
