import runtime from 'offline-plugin/runtime'
import { Notification } from 'element-ui'

runtime.install({
  onUpdateReady() {
    runtime.applyUpdate()
  },
  onUpdated() {
    console.info('Reload this page to apply updates!')
    Notification({
      title: 'CodePan has been updated!',
      message: 'Tap this or refresh page to apply updates.',
      duration: 10000,
      type: 'success',
      customClass: 'update-notifier',
      onClick() {
        window.location.reload()
      }
    })
  }
})
