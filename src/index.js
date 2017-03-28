import Vue from 'vue'
// @ is the path to `./src` folder
import App from '@/components/App'
import router from '@/router'
import store from '@/store'

if (process.env.NODE_ENV === 'production') {
  require('./pwa') // eslint-disable-line import/no-unassigned-import
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
