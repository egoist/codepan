import runtime from 'offline-plugin/runtime'
import { Notification } from 'element-ui'

runtime.install({
  onUpdateReady() {
    console.log('update ready')
    runtime.applyUpdate()
  },

  onUpdated() {
    Notification({ // eslint-disable-line new-cap
      title: 'New version is ready',
      type: 'info',
      message: 'CodePan has been updated in the background, you can refresh the page to apply updates!'
    })
  }
})
