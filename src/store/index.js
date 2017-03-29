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
      let html
      let js
      if (type === 'Vue') {
        [html, js] = await Promise.all([
          import('!raw-loader!@/boilerplates/vue/codepan.html'),
          import('!raw-loader!@/boilerplates/vue/codepan.js')
        ])
        await Promise.all([
          dispatch('updateTransformer', { type: 'js', transformer: 'JavaScript' }),
          dispatch('showPans', ['html', 'js', 'output'])
        ])
      } else if (type === 'React') {
        [html, js] = await Promise.all([
          import('!raw-loader!@/boilerplates/react/codepan.html'),
          import('!raw-loader!@/boilerplates/react/codepan.js')
        ])
        await Promise.all([
          dispatch('updateTransformer', { type: 'js', transformer: 'JSX' }),
          dispatch('showPans', ['html', 'js', 'output'])
        ])
      } else if (type === 'Preact') {
        [html, js] = await Promise.all([
          import('!raw-loader!@/boilerplates/preact/codepan.html'),
          import('!raw-loader!@/boilerplates/preact/codepan.js')
        ])
        await Promise.all([
          dispatch('updateTransformer', { type: 'js', transformer: 'JSX' }),
          dispatch('showPans', ['html', 'js', 'output'])
        ])
      } else if (type === 'RxJS') {
        [html, js] = await Promise.all([
          import('!raw-loader!@/boilerplates/rxjs/codepan.html'),
          import('!raw-loader!@/boilerplates/rxjs/codepan.js')
        ])
        await Promise.all([
          dispatch('updateTransformer', { type: 'js', transformer: 'JavaScript' }),
          dispatch('showPans', ['html', 'js', 'console'])
        ])
      }
      await Promise.all([
        dispatch('updateCode', { type: 'html', code: html }),
        dispatch('updateCode', { type: 'js', code: js })
      ])
      progress.done()
    }
  }
})

export default store
