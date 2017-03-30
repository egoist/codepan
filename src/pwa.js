import Vue from 'vue'
import runtime from 'offline-plugin/runtime'
import { Notification, Button } from 'element-ui'

const createNotifier = () => new Vue({
  data: {
    updating: false
  },
  created() {
    const h = this.$createElement
    this.notification = Notification({ // eslint-disable-line new-cap
      title: 'Detected an update for CodePan, apply updates will reload the tab automatically!',
      type: 'info',
      message: h('el-button', {
        on: { click: this.update },
        props: {
          icon: 'check',
          type: 'success',
          loading: this.updating
        }
      }, [this.updating ? 'Updating' : 'Apply Updates']),
      duration: 0
    })
  },
  methods: {
    update() {
      this.updating = true
      runtime.applyUpdate()
    }
  },
  components: {
    'el-button': Button
  }
})

let notifier

runtime.install({
  onUpdateReady() {
    console.log('update ready')
    notifier = createNotifier()
  },

  onUpdated() {
    console.log('updated')
    notifier.updating = false
    notifier.notification.close()
    location.reload()
  }
})
