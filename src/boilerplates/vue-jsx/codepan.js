const App = {
  render() {
    return <Counter initialCount={0} />
  }
}

const Counter = {
  props: ['initialCount'],
  data() {
    return {
      count: this.initialCount
    }
  },
  render() {
    return (
      <button
        class="button"
        onClick={() => this.count++}>
        {this.count}
      </button>
    )
  }
}

new Vue({
  el: '#app',
  render: h => h(App)
})
