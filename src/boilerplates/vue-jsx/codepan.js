const App = {
  data() {
    return {
      increment: 1
    }
  },
  render() {
    return (
      <div>
        Increment:{' '}
        <input type="number" v-model:number={this.increment} />
        <Counter initialCount={0} increment={this.increment} />
      </div>
    )
  }
}

const Counter = {
  props: ['initialCount', 'increment'],
  data() {
    return {
      count: this.initialCount
    }
  },
  render() {
    return (
      <div class="counter">
        <button
          class="button"
          onClick={() => this.count += this.increment}>
          Count: {this.count}
        </button>
      </div>
    )
  }
}

new Vue({
  el: '#app',
  render: h => h(App)
})
