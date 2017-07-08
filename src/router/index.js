import Vue from 'vue'
import Router from 'vue-router'
import progress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  progress.start()
  next()
})

export default router
