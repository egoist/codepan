new Vue({
  el: '#app',
  data: { count: 0 },
  methods: {
    inc() {
      this.count++
    },
    dec() {
      this.count--
    }
  }
})
