import './polyfill'
import Vue from 'vue'
import Tippy from 'v-tippy'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from '@/components/App.vue'
import router from '@/router'
import store from '@/store'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Tippy, {
  position: 'bottom'
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}
