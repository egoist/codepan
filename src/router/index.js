import Vue from 'vue'
import Router from 'vue-router'
import progress from 'nprogress'

Vue.use(Router)

const EditorPage = () => import(/* webpackChunkName: "editor-page" */ '@/views/EditorPage.vue')

const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: EditorPage
    },
    {
      name: 'gist',
      path: '/gist/:gist',
      component: EditorPage
    },
    {
      name: 'boilerplate',
      path: '/boilerplate/:boilerplate',
      component: EditorPage
    }
  ]
})

router.beforeEach((to, from, next) => {
  progress.start()
  next()
})

export default router
