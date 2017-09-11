<div id="app">
  <h2>{{ count }}</h2>
  <button on:click="inc()">inc</button>
  <button on:click="dec()">dec</button>
</div>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },

  methods: {
    inc() {
      this.set({
        count: this.get('count') + 1
      })
    },
    dec() {
      this.set({
        count: this.get('count') - 1
      })
    }
  }
}
</script>
