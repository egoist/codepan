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
  },
  render() {
    return (
      <div id="app">
        <h2>{this.count}</h2>
        <button onClick={this.inc}>inc</button>
        <button onClick={this.dec}>dec</button>
      </div>
    )
  }
})
